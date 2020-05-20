import moment from 'moment-jalaali';
export const columns = [
   { dataIndex: 'contract',key: 'contract', title: 'شماره پیمان / قرارداد' }, 

  // { dataIndex: 'prev_id',key: 'prev_id', title: 'شماره آخرین صورت وضعیت تایید شده مدیر طرح' },
 //  { dataIndex: 'prev_price',key: 'prev_price', title: 'مبلغ آخرین صورت وضعیت تایید شده مدیر طرح' },
   { dataIndex: 'no',key: 'no', title: 'شماره صورت وضعیت فعلی' }, 
   { dataIndex: 'start_date',key: 'start_date', title: 'تاریخ شروع دوره کارکرد' , render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' }  }, 
   { dataIndex: 'end_date',key: 'end_date', title: 'تاریخ پایان دوره کارکرد', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } },
   { dataIndex: 'contractor_price',key: 'contractor_price', title: 'مبلغ تجمعی ارائه شده پیمانکار' },
   { dataIndex: 'consultant_price',key: 'consultant_price', title: 'مبلغ تجمعی تایید نظارت' },
   { dataIndex: 'manager_price',key: 'manager_price', title: 'مبلغ تجمعی تایید مدیر طرح' }, 
   // { dataIndex: 'period_price',key: 'period_price', title: 'کارکرد دوره' }, 
   // { dataIndex: 'file_invoice',key: 'file_invoice', title: 'روکش صورت وضعیت' }, 
   // { dataIndex: 'decsciption',key: 'decsciption', title: 'توضیحات' },

    // { dataIndex: 'creator_id',key: 'creator_id', title: 'ایجاد کننده' }, 
    // { dataIndex: 'editor_id',key: 'editor_id', title: 'ویرایش کننده' }, 
    // { dataIndex: 'edit_date',key: 'edit_date', title: 'تاریخ ویرایش' , render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' }},
    // { dataIndex: 'create_date',key: 'create_date', title: 'تاریخ ایجاد' , render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' }},

   ];

export const storeIndex = "invoiceContractor";
export const pageHeder = 'صورت وضعیت پیمانکار';

export const emptyItem = { contract_id : ''  ,prev_id : '' ,prev_price : '' ,no_id : '' ,start_date : '' ,end_date : '' ,contractor_price : '' ,consultant_price : '' ,manager_price : '' ,period_price : '' ,file_invoice : '' ,decsciption : '' ,};


