import './scss/styles.scss';

import {LarekAPI} from "./components/LarekAPI";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {AppState, CatalogChangeEvent, PayChange} from "./components/AppData";
import {Page} from "./components/Page";
import {Card} from "./components/Card";
import {cloneTemplate, ensureElement} from "./utils/utils";
import {Modal} from "./components/common/Modal";
import {Basket} from "./components/common/Basket";
import {IProductItem, IDelivery, IContacts, IOrder} from "./types";
import {Contacts, Delivery} from "./components/Order";
import {Success} from "./components/common/Success";

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');

const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');


// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const delivery = new Delivery(cloneTemplate(orderTemplate),events,{
    onClick:function(ev:Event) {
        events.emit('payment:toggle',ev.target);
    }
})
const contact = new Contacts(cloneTemplate(contactsTemplate),events);
const basket = new Basket(cloneTemplate(basketTemplate), events);


// Бизнес-логика
// Поймали событие, сделали что нужно

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
        const card = new Card(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            image: item.image,
            category: item.category,
            price: item.price
        });
    });
});

// Отправлена форма заказа
events.on('order:submit', () => {
    api.orderProduct(appData.order)
        .then((result) => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
                }
            });

            appData.cleanBasket();
            appData.cleanOrder();

            success.descriptionTotl = result.total.toString();

            modal.render({
                content: success.render({})
            });
        })
        .catch(err => {
            console.error(err);
        });
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrder>) => {
    const {email, phone, payment, address} = errors;
    contact.valid = !email && !phone;
    contact.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
    delivery.valid = !payment && !address;   
    delivery.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей
events.on(/^order\..*:change/, (data: { field: keyof IDelivery, value: string }) => {
    appData.setDelivery(data.field, data.value);
});

events.on(/^contacts\..*:change/, (data: { field: keyof IContacts, value: string }) => {
    appData.setContacts(data.field, data.value);
});

// Открыть форму заказа/доставки
events.on('order:open', () => {
    modal.render({
        content: delivery.render({
            payment: '',    
            address: '',
            valid: false,
            errors: []
        })
    });
    appData.order.items = appData.basket.map((item) => {
        return item.id;
    });
});

// Открыть корзину
events.on('basket:open', () => {
    modal.render({
        content: basket.render({})
    });
});


// Изменения в корзине, все пересчитать
events.on('basket:changed', (items: IProductItem[]) => {
    
    basket.items = items.map((item, index) => {
        const card = new Card(cloneTemplate(cardBasketTemplate), {
            onClick: () => {
                events.emit('product:delete', item);
            }
        });

        return card.render({
            index: (index + 1).toString(),
            title: item.title,
            price: item.price,                
        });
    });

//        const total = items.reduce((total, item)=>{
//            return total + item.price;}, 0);
//    basket.total = total;

    basket.total = appData.getTotal();
    appData.order.total = appData.getTotal();
    basket.buttonBlocked(basket.total === 0);          
    });

// Счетчик элементов в корзине.

    events.on('counter:changed', (item: string[]) => {
	page.counter = appData.basket.length;
    }
    );
    
// Открыть товар
events.on('card:select', (item: IProductItem) => {
    appData.setPreview(item);
});

// Изменен открытый выбранный товар
events.on('preview:changed', (item: IProductItem) => {
    const card = new Card(cloneTemplate(cardPreviewTemplate),{
        onClick:()=>{
            events.emit('product:toggle',item);
            card.titleBtn = appData.basket.indexOf(item)<0?'Оплатить':'Убрать'}
        });       

        modal.render({
            content: card.render({
                category: item.category,
                title: item.title,
                image: item.image,
                price: item.price,
                description: item.description,
                titleBtn:appData.basket.indexOf(item)<0?'Оплатить':'Убрать',
            })
        });
});    

//Работа с состоянием товара
events.on('product:toggle',(item:IProductItem)=>{
    if (appData.basket.indexOf(item)<0) {
        events.emit('product:add',item);
    } else {
        events.emit('product:delete',item)
    };
});
events.on('product:delete', (item: IProductItem)=>appData.removeItem(item));

events.on('product:add', (item: IProductItem)=>appData.addItem(item));

//Изменить способ оплаты
events.on('payment:toggle',(target:HTMLElement)=>{
    if(!target.classList.contains('button_alt-active')){
        delivery.toggleButton(target);
        appData.order.payment = PayChange[target.getAttribute('name')];
        console.log(appData.order);
    }
});

//Перейти к форме контактов
events.on('order:submit',()=>{
    modal.render({
        content: contact.render({
            email:'',
            phone:'',
            valid:false,
            errors:[],
        }),
    });
});

//Контакты заполнены
events.on('contacts:ok',() => {
    contact.valid = true;
});

//Доставка заполнена
events.on('delivery:ok',() => {
    delivery.valid = true;
});








// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});

// Получаем лоты с сервера
api.getProductList()
    .then(appData.setItems.bind(appData))
    .catch(err => {
        console.error(err);
    });


