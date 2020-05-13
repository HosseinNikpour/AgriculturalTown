
import moment from 'moment-jalaali';
export const columns = [
    // { dataIndex: 'creator_id',key: 'creator_id', title: 'creator_id' },
    //  { dataIndex: 'editor_id',key: 'editor_id', title: 'editor_id' }, 
    //  { dataIndex: 'edit_date',key: 'edit_date', title: 'edit_date' }, 
    //  { dataIndex: 'create_date',key: 'create_date', title: 'create_date' }, 
    //  { dataIndex: 'current_user_id',key: 'current_user_id', title: 'current_user_id' }, 
    //  { dataIndex: 'status',key: 'status', title: 'status' }, 
    { dataIndex: 'id',key: 'id', title: 'شناسه ' }, 
     { dataIndex: 'title',key: 'title', title: 'عنوان' }, 
     { dataIndex: 'start_date',key: 'start_date', title: 'تاریخ شروع' , render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD') :''}},
      { dataIndex: 'end_date',key: 'end_date', title: 'تاریخ پایان' , render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD') :''}},
       { dataIndex: 'month',key: 'month', title: 'ماه' },

];

export const storeIndex = "Period";
export const pageHeder = 'دوره ها';

export const emptyItem = { title : '' ,start_date : '' ,end_date : '' ,month : ''  };