import moment from 'moment-jalaali';
export const columns = [
    { dataIndex: 'contract',key: 'contract', title: 'شماره قرارداد/پیمان' }, 
    { dataIndex: 'insurance',key: 'insurance', title: 'بیمه پیمان' },
    { dataIndex: 'start_date',key: 'start_date', title: 'تاریخ شروع', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' }  },
    { dataIndex:'end_date',key: 'end_date', title: 'تاریخ پایان', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' }  }, 
    { dataIndex: 'price',key: 'price', title: 'مبلغ حق بیمه' },
   // { dataIndex: 'creator_id',key: 'creator_id', title: 'ایجاد کننده' },
   // { dataIndex: 'editor_id',key: 'editor_id', title: 'ویرایش کننده' },
   // { dataIndex: 'edit_date',key: 'edit_date', title: 'تاریخ ویرایش', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } },
   // { dataIndex: 'create_date',key: 'create_date', title: 'تاریخ ایجاد', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } },
   // { dataIndex: 'current_user_id',key: 'current_user_id', title: 'کاربر جاری' }, 
   // { dataIndex: 'status',key: 'status', title: 'وضعیت' }
   ];
   export const storeIndex = "insuranceAppendix";
   export const pageHeder = 'الحاقیه بیمه';
   
   export const emptyItem = {
    contract_id : '' ,insurance_id : '' ,start_date : '' ,end_date : '' ,price : '' ,
   };