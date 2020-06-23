import moment from 'moment-jalaali';
import React, { Component } from 'react';
export const columns = [
{ dataIndex: 'contract',key: 'contract', title: 'شماره پیمان/قرارداد' },
{ dataIndex: 'vw_company',key: 'vw_company', title: 'نام شرکت ' },
{ dataIndex: 'vw_contract_title',key: 'vw_contract_title', title: 'عنوان پروژه ' },
{ dataIndex: 'no',key: 'no', title: 'شماره تغییر مقادیر' },
//{ dataIndex: 'project',key: 'project', title: 'مبلغ اولیه پیمان', render: function (text) { return  text?parseInt(text).toLocaleString():0 } }, 
//{ dataIndex: 'increase_price',key: 'increase_price', title: 'مبلغ افزایش یافته', render: function (text) { return  text?parseInt(text).toLocaleString():0 } }, 
//{ dataIndex: 'decrease_price',key: 'decrease_price', title: 'مبلغ کاهش یافته', render: function (text) { return  text?parseInt(text).toLocaleString():0 } },
//{ dataIndex: 'new_work',key: 'new_work', title: 'مبلغ کار جدید', render: function (text) { return  text?parseInt(text).toLocaleString():0 } },
//{ dataIndex: 'change_price',key: 'change_price', title: 'مبلغ تغییر مقادیر ', render: function (text) { return  text?parseInt(text).toLocaleString():0 } },
//{ dataIndex: 'contract_new_price_calc',key: 'contract_new_price_calc', title: 'مبلغ پیمان با احتساب تغییر مقادیر', render: function (text) { return  text?parseInt(text).toLocaleString():0 } }, 
{ dataIndex: 'contract_new_price',key: 'contract_new_price', title: 'مبلغ پیمان با احتساب تغییر مقادیر', render: function (text) { return  text?parseInt(text).toLocaleString():0 } },
//{ dataIndex: 'increase_price_percent',key: 'increase_price_percent', title: 'درصد تغییرات(افزایش)' },
//{ dataIndex: 'decrease_price_percent',key: 'decrease_price_percent', title: 'درصد تغییرات( کاهش)' }, 
//{ dataIndex: 'new_work_percent',key: 'new_work_percent', title: 'درصد کارجدید' }, 
//{ dataIndex: 'change_price_percent',key: 'change_price_percent', title: 'درصد کل افزایش یا کاهش' },
//{ dataIndex: 'has_license',key: 'has_license', title: 'مجوز جمع جبری دارد' , render: function (text) { return text ? 'بلی' : 'خیر' } }, 
{ dataIndex: 'file_signification',key: 'file_signification', title: 'نامه ابلاغ تغییر مقادیر',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} }, 
{ dataIndex: 'file_25percent',key: 'file_25percent', title: 'نامه ابلاغ  25 درصد',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} }, 
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


