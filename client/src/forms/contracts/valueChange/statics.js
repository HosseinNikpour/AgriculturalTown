import moment from 'moment-jalaali';
export const columns = [
{ dataIndex: 'contract',key: 'contract', title: 'شماره پیمان/قرارداد' },
{ dataIndex: 'no',key: 'no', title: 'شماره تغییر مقادیر' },
{ dataIndex: 'increase_price',key: 'increase_price', title: 'مبلغ افزایش یافته' }, 
{ dataIndex: 'decrease_price',key: 'decrease_price', title: 'مبلغ کاهش یافته' },
{ dataIndex: 'new_work',key: 'new_work', title: 'بهای کار جدید' },
{ dataIndex: 'change_price',key: 'change_price', title: 'بهای تغییر مقادیر ' },
{ dataIndex: 'contract_new_price_calc',key: 'contract_new_price_calc', title: 'مبلغ پیمان با احتساب تغییر مقادیر' }, 
{ dataIndex: 'contract_new_price',key: 'contract_new_price', title: 'مبلغ پیمان با احتساب تغییر مقادیر' },
{ dataIndex: 'increase_price_percent',key: 'increase_price_percent', title: 'درصد تغییرات(افزایش)' },
{ dataIndex: 'decrease_price_percent',key: 'decrease_price_percent', title: 'درصد تغییرات( کاهش)' }, 
//{ dataIndex: 'new_work_percent',key: 'new_work_percent', title: 'درصد کارجدید' }, 
//{ dataIndex: 'change_price_percent',key: 'change_price_percent', title: 'درصد کل افزایش یا کاهش' },
//{ dataIndex: 'has_license',key: 'has_license', title: 'مجوز جمع جبری دارد' }, 
//{ dataIndex: 'file_signification',key: 'file_signification', title: 'نامه ابلاغ تغییر مقادیر' }, 
//{ dataIndex: 'file_25percent',key: 'file_25percent', title: 'نامه ابلاغ  25 درصد' }, 
//{ dataIndex: 'description',key: 'description', title: 'توضیحات' },
//{ dataIndex: 'creator_id',key: 'creator_id', title: 'ایجاد کننده' },
//{ dataIndex: 'editor_id',key: 'editor_id', title: 'ویرایش کننده' },
//{ dataIndex: 'edit_date',key: 'edit_date', title: 'تاریخ ویرایش', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } },
//{ dataIndex: 'create_date',key: 'create_date', title: 'تاریخ ایجاد', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } },
//{ dataIndex: 'current_user_id',key: 'current_user_id', title: 'کاربر جاری' }, 
//{ dataIndex: 'status',key: 'status', title: 'وضعیت' }
 ];

export const storeIndex = "valueChange";
export const pageHeder = 'تغییر مقادیر';

export const emptyItem = { 
contract_id : '' ,no_id : '' ,increase_price : '' ,decrease_price : '' ,new_work : '' ,change_price : '' ,contract_new_price_calc : '' ,contract_new_price : '' ,increase_price_percent : '' ,decrease_price_percent : '' ,new_work_percent : '' ,change_price_percent : '' ,has_license : '' ,has25 : '' ,file_signification : '' ,file_25percent : '' ,description : ''};


