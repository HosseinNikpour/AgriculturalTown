import moment from 'moment-jalaali';
import React, { Component } from 'react';
export const columns = [
{ dataIndex: 'title',key: 'title', title: 'عنوان' }, 
//{ dataIndex: 'town',key: 'town', title:'شهرک' }, 
{ dataIndex: 'group',key: 'group', title: 'گروه' }, 
//{ dataIndex: 'type',key: 'type', title: 'نوع مناقصه' }, 
//{ dataIndex: 'service_type',key: 'service_type', title: 'نوع خدمات' },
//{ dataIndex: 'operation_type',key: 'operation_type', title: 'نوع عملیات' }, 

{ dataIndex: 'modifier_type',key: 'modifier_type', title: 'مراحل بررسی' }, 

{ dataIndex: 'commission_date',key: 'commission_date', title: 'تاریخ تشکیل کمیسیون', render: function (text) { return  text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD'):'' } },
{ dataIndex: 'commission_result_id',key: 'commission_result_id', title: 'نتیجه کمیسیون' },


//{ dataIndex: 'invite_method_id',key: 'invite_method_id', title: 'روش دعوت' },
{ dataIndex: 'call_method_id',key: 'call_method_id', title: 'فراخوان' },
//{ dataIndex: 'recommender_count',key: 'recommender_count', title: 'تعداد پیشنهاد دهنده' },
{ dataIndex: 'tender_no',key: 'tender_no', title: 'شماره مناقصه' },
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
,group_id : '' ,type_id : '' ,service_type_id : '' ,operation_type_id : '',modifier_type_id : '' ,commission_date : '' ,commission_result_id : '' ,file_record : '' ,description : '' 
};


