import moment from 'moment-jalaali';
import React, { Component } from 'react';
export const columns = [
    { dataIndex: 'id', key: 'id', title: 'شناسه', selected: true },
    { dataIndex: 'title', key: 'title', title: 'عنوان قرارداد', selected: true },
    { selected: true, dataIndex: 'contract_no', key: 'contract_no', title: 'شماره قرارداد' },
    { selected: true, dataIndex: 'town', key: 'town', title: 'نام شهرک' },
    { selected: true, dataIndex: 'company', key: 'company', title: 'شرکت' },
    //  { dataIndex: 'colleague1_id',key: 'colleague1', title: 'شرکت همکار1' }, 
    //  { dataIndex: 'colleague2_id',key: 'colleague2', title: 'شرکت همکار2' }, 
     //{ selected:true,dataIndex: 'contract_type',key: 'contract_type', title: 'نوع قرارداد' }, 
    { selected:true,dataIndex: 'contract_date',key: 'contract_date', title: 'تاریخ قرارداد', render: function (text) { return text&&moment.isMoment(text)?text.format('jYYYY/jMM/jDD') :''}},  
    //  { dataIndex: 'announcement_date',key: 'announcement_date', title: 'تاریخ ابلاغ قرارداد' }, 
    //  { dataIndex: 'end_date',key: 'end_date', title: 'تاریخ اولیه اتمام' }, 
    //  { dataIndex: 'duration',key: 'duration', title: 'مدت' },
      { selected:true,dataIndex: 'initial_amount',key: 'initial_amount', title: 'مبلغ اولیه', render: function (text) { return  text?text.toLocaleString():0 } }, 
      { dataIndex: 'client_initial_amount',key: 'client_initial_amount', title: 'مبلغ برآورد اولیه کارفرما', render: function (text) { return  text?text.toLocaleString():0 } }, 
    //  { selected:true,dataIndex: 'coefficient',key: 'coefficient', title: 'ضریب ' , render: function (text) { return parseFloat(text).toFixed(2) } },
    // { dataIndex: 'file_agreement',key: 'file_agreement', title: 'موافقتنامه ',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} },
   // { dataIndex: 'file_announcement',key: 'file_announcement', title: 'صورتجلسه ابلاغ',render :function(text){return text?<a target="_blank" href={text}>مشاهده </a>:''} },
    { selected:true,dataIndex: 'study_surface',key: 'study_surface', title: 'سطح مطالعات (قرارداد)', render: function (text) { return  text?text.toLocaleString():0 } },
    { selected:true,dataIndex: 'study_surface_final',key: 'study_surface_final', title: 'سطح نهایی مطالعات', render: function (text) { return  text?text.toLocaleString():0 } }, 
    { selected:true,dataIndex: 'mapping_surface',key: 'mapping_surface', title: 'سطح نقشه برداری (قرارداد)', render: function (text) { return  text?text.toLocaleString():0 } }, 
    { selected:true,dataIndex: 'mapping_surface_final',key: 'mapping_surface_final', title: 'مسطح نهایی نقشه برداری', render: function (text) { return  text?text.toLocaleString():0 } },
    //  { dataIndex: 'project_manager_name',key: 'project_manager_name', title: 'مدیر پروژه' },
    //  { dataIndex: 'project_manager_contacts',key: 'project_manager_contacts', title: 'تلفن همراه مدیر پروژه' },
	  // { dataIndex: 'fax',key: 'fax', title: 'فکس' },
	  // { dataIndex: 'email',key: 'email', title: 'ایمیل' },
	

];
export const storeIndex = "Agreement";
export const pageHeder = 'شناسنامه قرارداد';

export const emptyItem = {
    title: '', operation_type_id:[], contract_no: '', town_id: '', company_id: '',
    colleague1_id: '', colleague2_id: '', contract_type_id: '', contract_date: undefined, announcement_date: '',
    land_delivery_date: '', end_date: '', duration: '', initial_amount: "", client_initial_amount: '',
    coefficient: undefined, file_agreement: '', file_announcement: '', file_delivery: '', project_manager_name: '',
    project_manager_contacts: '', study_surface: '', study_surface_final: '', mapping_surface: '',
	 mapping_surface_final: '', fax: '', email: ''
}








