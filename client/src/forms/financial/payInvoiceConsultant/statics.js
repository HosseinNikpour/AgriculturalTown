import moment from 'moment-jalaali';
export const columns = [
 { dataIndex: 'contract',key: 'contract', title: 'شماره پیمان / قرارداد' },
{ dataIndex: 'prev_approve_id',key: 'prev_approve_id', title: 'شماره آخرین صورت وضعیت تایید شده مدیر طرح' }, 
{ dataIndex: 'prev_id',key: 'prev_id', title: 'شماره آخرین صورت وضعیت پرداخت شده مالی' },
 { dataIndex: 'prev_approve_price',key: 'prev_approve_price', title: 'مبلغ آخرین صورت وضعیت تایید شده مدیر طرح' }, 
 { dataIndex: 'prev_price',key: 'prev_price', title: 'مبلغ آخرین صورت وضعیت پرداخت شده مالی' },
 { dataIndex: 'no',key: 'no', title: 'شماره صورت وضعیت فعلی' },
 { dataIndex: 'price',key: 'price', title: 'مبلغ قابل پرداخت تجمعی' }, 
 { dataIndex: 'period_price',key: 'period_price', title: 'مبلغ قابل پرداخت در دوره' },
 { dataIndex: 'pay_date',key: 'pay_date', title: 'تاریخ سند پرداخت' , render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } }, 
 //{ dataIndex: 'type',key: 'type', title: 'نوع پرداخت' },
 //{ dataIndex: 'credit',key: 'credit', title:'نوع اعتبارات' }, 
 //  { dataIndex: 'decsciption',key: 'decsciption', title: 'توضیحات' },

    // { dataIndex: 'creator_id',key: 'creator_id', title: 'ایجاد کننده' }, 
    // { dataIndex: 'editor_id',key: 'editor_id', title: 'ویرایش کننده' }, 
    // { dataIndex: 'edit_date',key: 'edit_date', title: 'تاریخ ویرایش' , render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' }},
    // { dataIndex: 'create_date',key: 'create_date', title: 'تاریخ ایجاد' , render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' }},

   ];

export const storeIndex = "payInvoiceConsultant";
export const pageHeder = 'پرداخت صورت وضعیت مشاور';

export const emptyItem = { contract_id : '' ,prev_approve_id : '' ,prev_id : '' ,prev_approve_price : '' ,prev_price : '' ,no_id : '' ,approve_price : '' ,price : '' ,period_price : '' ,pay_date : '' ,type_id : '' ,credit_id : '' ,decsciption : '' ,};


