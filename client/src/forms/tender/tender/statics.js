import moment from 'moment-jalaali';
import React, { Component } from 'react';
export const columns = [
    { dataIndex: 'id',key: 'id', title: 'شناسه ' },
{ dataIndex: 'title',key: 'title', title: 'عنوان' }, 
//{ dataIndex: 'town',key: 'town', title:'شهرک' }, 
{ dataIndex: 'group',key: 'group', title: 'گروه' }, 
//{ dataIndex: 'type',key: 'type', title: 'نوع مناقصه' }, 
//{ dataIndex: 'service_type',key: 'service_type', title: 'نوع خدمات' },
//{ dataIndex: 'operation_type',key: 'operation_type', title: 'نوع عملیات' }, 

{ dataIndex: 'modifier_type',key: 'modifier_type', title: 'مراحل بررسی' }, 

{ dataIndex: 'commission_date',key: 'commission_date', title: 'تاریخ تشکیل کمیسیون', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } },
{ dataIndex: 'commission_result',key: 'commission_result', title: 'نتیجه کمیسیون' },


//{ dataIndex: 'invite_method',key: 'invite_method', title: 'روش دعوت' },
{ dataIndex: 'call_method',key: 'call_method', title: 'فراخوان' },
//{ dataIndex: 'recommender_count',key: 'recommender_count', title: 'تعداد پیشنهاد دهنده' },
{ dataIndex: 'tender_no',key: 'tender_no', title: 'شماره مناقصه' },
{ dataIndex: 'tenindicator_noder_no',key: 'indicator_no', title: 'اندیکاتور' },
//{ dataIndex: 'invite_no',key: 'invite_no', title: 'شماره دعوتنامه' },
//{ dataIndex: 'invite_date',key: 'invite_date', title: 'تاریخ دعوتنامه', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' }  },
//{ dataIndex: 'init_amount',key: 'init_amount', title: 'مبلغ پایه برآورد', render: function (text) { return  text?parseInt(text).toLocaleString():0 } },
{ dataIndex: 'first_winner_name',key: 'first_winner_name', title: 'نام شرکت برنده اول' },
{ dataIndex: 'first_winner_amount',key: 'first_winner_amount', title: 'مبلغ پیشنهادی برنده اول', render: function (text) { return  text?parseInt(text).toLocaleString():0 } },
//{ dataIndex: 'second_winner_name',key: 'second_winner_name', title: 'نام شرکت برنده دوم' },
//{ dataIndex: 'second_winner_amount',key: 'second_winner_amount', title: 'مبلغ پیشنهادی برنده دوم', render: function (text) { return  text?parseInt(text).toLocaleString():0 } },
//{ dataIndex: 'file_invite',key: 'file_invite', title: 'بارگذاری دعوتنامه',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} }, 
{ dataIndex: 'file_record',key: 'file_record', title: 'بارگذاری صورتجلسه',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} },
//{ dataIndex: 'description',key: 'description', title: 'توضیحات' },
//{ dataIndex: 'creator_id',key: 'creator_id', title: 'ایجاد کننده' },
//{ dataIndex: 'editor_id',key: 'editor_id', title: 'ویرایش کننده' },
//{ dataIndex: 'edit_date',key: 'edit_date', title: 'تاریخ ویرایش', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } },
//{ dataIndex: 'create_date',key: 'create_date', title: 'تاریخ ایجاد', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } },
//{ dataIndex: 'current_user_id',key: 'current_user_id', title: 'کاربر جاری' }, 
//{ dataIndex: 'status',key: 'status', title: 'وضعیت' }
 ];

export const storeIndex = "tender";
export const pageHeder = 'مناقصات';

export const emptyItem = { 
title : '' ,town_id : ''
,group_id : '' ,type_id : '' ,service_type_id : '' ,operation_type_id : '',modifier_type_id : '' ,invite_method_id : '',call_method_id : '',recommender_count : '' ,tender_no : '' ,invite_no : '' ,invite_date : '' ,init_amount : '' ,first_winner_name : '' ,second_winner_name : '' ,first_winner_amount : '' ,second_winner_amount : '' ,file_invite : '' ,
commission_date : '' ,commission_result_id : '' ,file_record : '' ,description : '' ,
call_number : '' ,min_grade : '' ,warranty_price : '' ,signification_date : ''  ,send_document_letter_number : '' , send_document_date: '' 
,contract_price : ''  ,credit_type_id : ''  ,winner_letter_no : ''  ,winner_letter_date : '' ,indicator_no : ''   
};


