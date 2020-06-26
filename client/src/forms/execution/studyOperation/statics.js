import moment from 'moment-jalaali';
export const columns = [
    { dataIndex: 'id',key: 'id', title: 'شناسه' }, 
    { dataIndex: 'contract',key: 'contract', title: 'قرارداد' }, 
    { dataIndex: 'report_date',key: 'report_date', title: 'تاریخ گزارش' , render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' }  },
   
];
export const storeIndex = "studyOperation";
export const pageHeder = 'پیشرفت مطالعات';

export const emptyItem = {
    operation_id : '', contract_id : ''  ,wieght : '' ,sort:'' 
};