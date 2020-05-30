import moment from 'moment-jalaali';
export const columns = [
{ dataIndex: 'title',key: 'title', title: 'عنوان' }, 
{ dataIndex: 'town_id',key: 'town_id', title:'شهرک' }, 
{ dataIndex: 'group_id',key: 'group_id', title: 'گروه' }, 
{ dataIndex: 'type_id',key: 'type_id', title: 'نوع مناقصه' }, 
{ dataIndex: 'service_type_id',key: 'service_type_id', title: 'نوع خدمات' },
{ dataIndex: 'operation_type_id',key: 'operation_type_id', title: 'نوع عملیات' }, 
{ dataIndex: 'document_type_id',key: 'document_type_id', title: 'وضعیت اسناد' },
{ dataIndex: 'modifier_type_id',key: 'modifier_type_id', title: 'مراحل بررسی' }, 
{ dataIndex: 'publish_date',key: 'publish_date', title: 'تاریخ انتشار', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } }, 
{ dataIndex: 'get_doc_date',key: 'get_doc_date', title: ' آخرین مهلت دریافت اسناد', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } },
{ dataIndex: 'upload_date',key: 'upload_date', title: 'آخرین مهلت بارگذاری', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' }  },
{ dataIndex: 'commission_date',key: 'commission_date', title: 'تاریخ تشکیل کمیسیون', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } },
{ dataIndex: 'commission_result_id',key: 'commission_result_id', title: 'نتیجه کمیسیون' },
{ dataIndex: 'open_packets_date',key: 'open_packets_date', title: 'تاریخ گشایش پاکت مالی', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } },
{ dataIndex: 'say_to_winner_date',key: 'say_to_winner_date', title: 'تاریخ ابلاغ به برنده', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } }, 
{ dataIndex: 'contract_date',key: 'contract_date', title: 'تاریخ انعقاد قرارداد', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } },
{ dataIndex: 'file_record',key: 'file_record', title: 'بارگذاری صورتجلسه' },
{ dataIndex: 'description',key: 'description', title: 'توضیحات' },
{ dataIndex: 'creator_id',key: 'creator_id', title: 'ایجاد کننده' },
{ dataIndex: 'editor_id',key: 'editor_id', title: 'ویرایش کننده' },
{ dataIndex: 'edit_date',key: 'edit_date', title: 'تاریخ ویرایش', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } },
{ dataIndex: 'create_date',key: 'create_date', title: 'تاریخ ایجاد', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } },
{ dataIndex: 'current_user_id',key: 'current_user_id', title: 'کاربر جاری' }, 
{ dataIndex: 'status',key: 'status', title: 'وضعیت' }
 ];

export const storeIndex = "tender";
export const pageHeder = 'مناقصات';

export const emptyItem = { 
title : '' ,town_id : ''
,group_id : '' ,type_id : '' ,service_type_id : '' ,operation_type_id : '' ,document_type_id : '' ,modifier_type_id : '' ,publish_date : '' ,get_doc_date : '' ,upload_date : '' ,commission_date : '' ,commission_result_id : '' ,open_packets_date : '' ,say_to_winner_date : '' ,contract_date : '' ,file_record : '' ,description : '' 
};


