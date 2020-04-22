// import pool from './pool';
const pool = require('./pool');
pool.on('connect', () => {
    console.log('connected to the db');
});

let queries = [`CREATE TABLE public.tbl_base (
                creator_id integer,
                editor_id integer,
                edit_date timestamp with time zone,
                create_date timestamp with time zone,
                current_user_id integer,
                status character varying COLLATE pg_catalog."default"
            )`,
    `CREATE TABLE public.baseinfo (
                id serial,
                title character varying(500) COLLATE pg_catalog."default" NOT NULL,
                value character varying(100) COLLATE pg_catalog."default",
                sort integer,
                groupid integer NOT NULL,
                CONSTRAINT baseinfo_pkey PRIMARY KEY (id)
            ) INHERITS (public.tbl_base) `,
    `CREATE TABLE public.company (
                id serial,
                title character varying(300) COLLATE pg_catalog."default" NOT NULL,
                full_title character varying(300) COLLATE pg_catalog."default",
                meli_code character varying(50) COLLATE pg_catalog."default",
                economic_code character varying(50) COLLATE pg_catalog."default",
                registration_number character varying(50) COLLATE pg_catalog."default",
                registration_province_id integer,
                certificate_type_id integer,
                province_id integer,
                city character varying(50) COLLATE pg_catalog."default",
                address character varying(500) COLLATE pg_catalog."default",
                postalcode character varying(50) COLLATE pg_catalog."default",
                tell character varying(50) COLLATE pg_catalog."default",
                fax character varying(50) COLLATE pg_catalog."default",
                rating1 character varying(500) COLLATE pg_catalog."default",
                rating2 character varying(500) COLLATE pg_catalog."default",
                CONSTRAINT company_pkey PRIMARY KEY (id)
            )INHERITS (public.tbl_base) `,
    `CREATE TABLE public.contract (
                id serial,
                title character varying(300) COLLATE pg_catalog."default" NOT NULL,
                full_title character varying(300) COLLATE pg_catalog."default",
                contract_no character varying(50) COLLATE pg_catalog."default",
                project_id integer,
                company_id integer,
                colleague1_id integer,
                colleague2_id integer,
                contract_type character varying(50) COLLATE pg_catalog."default",
                contract_date date,
                announcement_date date,
                land_delivery_date date,
                end_date date,
                duration integer,
                initial_amount bigint,
                client_initial_amount bigint,
                coefficient numeric(18,10),
                file_agreement character varying(500) COLLATE pg_catalog."default",
                file_announcement character varying(500) COLLATE pg_catalog."default",
                file_delivery character varying(500) COLLATE pg_catalog."default",
                project_manager_name character varying(500) COLLATE pg_catalog."default",
                project_manager_contacts character varying(500) COLLATE pg_catalog."default",
                CONSTRAINT contract_pkey PRIMARY KEY (id)
            )INHERITS (public.tbl_base) `,
    `CREATE TABLE public.project (
                id serial,
                title character varying(500) COLLATE pg_catalog."default",
                full_title character varying(500) COLLATE pg_catalog."default",
                town_id integer,
                CONSTRAINT project_pkey PRIMARY KEY (id)
            )INHERITS (public.tbl_base) `,
    `CREATE TABLE public.town (
                id serial,
                title character varying(500) COLLATE pg_catalog."default",
                province_id integer,
                city character varying(100) COLLATE pg_catalog."default",
                gross_area numeric(18,2),
                pure_area numeric(18,2),
                inityear integer,
                activity_type_id integer,
                ownership_type_id integer,
                water_supply_id integer,
                water_rate numeric(18,2),
                power_supply_id integer,
                power_rate numeric(18,2),
                gas_supply_id integer,
                gas_rate numeric(18,2),
                total_units integer,
                used_units integer,
                used_number integer,
                location_id integer,
                coordinate_e numeric(10,6),
                coordinate_n numeric(10,7),
                file_dxf character varying(500) COLLATE pg_catalog."default",
                file_kmz character varying(500) COLLATE pg_catalog."default",
                CONSTRAINT town_pkey PRIMARY KEY (id)
            )INHERITS (public.tbl_base)`,
    `CREATE TABLE public.user (
                id serial,
                username character varying(100) COLLATE pg_catalog."default" NOT NULL,
                name character varying(100) COLLATE pg_catalog."default",
                password character varying(500) COLLATE pg_catalog."default" NOT NULL,
                last_login date,
                role character varying(100) COLLATE pg_catalog."default",
                created_on timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
                enabled boolean DEFAULT true,
                "isAdmin" boolean DEFAULT false,
                CONSTRAINT users_pkey PRIMARY KEY (id),
                CONSTRAINT users_username_key UNIQUE (username)
            )`,
    `CREATE TABLE public.role (
        id serial,
        title character varying(500) COLLATE pg_catalog."default" NOT NULL,
        type character varying(100) COLLATE pg_catalog."default" NOT NULL
       )`,
    `CREATE TABLE public.per_structure (
                id serial,
                entity_name_id integer,
                item_creator_id integer,
                item_approver_id integer[],
                item_viewer_id integer[],
                item_editor_id integer[],              
                CONSTRAINT per_structure_pkey PRIMARY KEY (id),
                CONSTRAINT "uniqe_entity_name" UNIQUE (entity_name_id)
            )INHERITS (public.tbl_base)`];
const createAllTables = () => {
    queries.forEach(async(Query) => {
       let res=await pool.query(Query);
            // .then((res) => {
                console.log(res);
                 pool.end();
            // })
            // .catch((err) => {
            //     console.log(err);
            //     pool.end();
            // });
    });
}

const viewQueries = [`CREATE or REPLACE view vw_company AS
                    select c.*,b1.title as province,b2.title as Registration_Province
                    from company as c join baseinfo as b1 on c.province_id =b1.id
                                    join baseinfo as b2 on c.Registration_Province_id =b2.id`,
    `CREATE or REPLACE view vw_contract AS
                    select c.*,co1.title as company,col2.title as colleague1,col3.title as colleague2,p.title as project
                    from contract as c  join company as co1 on c.company_id=co1.id
                                        join company as co2 on c.colleague1_id=co2.id
                                        join company as co3 on c.colleague2_id=co3.id
                                        join project as p on c.project_id=p.id`,
    `CREATE or REPLACE view vw_project AS
                    select p.*,t.title as town
                    from project as p join town as t on p.town_id=t.id`,
    `CREATE or REPLACE view vw_town AS
                    select t.*,b1.title AS province,b2.title AS activity_type,b3.title AS ownership_type,b4.title AS water_supply,b5.title AS power_supply,b6.title AS gas_supply
                    from town as t  JOIN baseinfo b1 ON t.province_id = b1.id
                                    JOIN baseinfo b2 ON t.activity_type_id = b2.id
                                    JOIN baseinfo b3 ON t.ownership_type_id = b3.id
                                    JOIN baseinfo b4 ON t.water_supply_id = b4.id
                                    JOIN baseinfo b5 ON t.power_supply_id = b5.id
                                    JOIN baseinfo b6 ON t.gas_supply_id = b6.id
                                    JOIN baseinfo b7 ON t.location_id = b7.id`,
    `CREATE or REPLACE view vw_per_structure AS
                   select * ,r1.title as item_creator,r2.title as item_approver,r3.title as item_viewer,r4.title as item_editor,b.title as entity_name
                   from per_structure as ps join role as r1 on ps.item_creator_id=r1.id
                                            join role as r2 on ps.item_approver_id=r2.id
                                            join role as r3 on ps.item_viewer_id=r3.id
                                            join role as r4 on ps.item_editor_id=r4.id
                                            join baseinfo as b on ps.entity_name_id=b.id
                   `]


const createAllViews = () => {
    viewQueries.forEach(Query => {
        pool.query(Query)
            .then((res) => {
                console.log(res);
                pool.end();
            })
            .catch((err) => {
                console.log(err);
                pool.end();
            });
    });
}
createAllTables();
//createAllViews();
// Create Tables

// const createUserTable = () => {
//     const Query = `CREATE TABLE IF NOT EXISTS Users
//   (id SERIAL PRIMARY KEY, 
//   username VARCHAR(100) UNIQUE NOT NULL, 
//   name VARCHAR(100), 
//   password VARCHAR(500) NOT NULL,
//   last_login DATE ,
//   role VARCHAR(100),
//   created_on DATE ,
//   enabled boolean DEFAULT true)`;

//     pool.query(Query)
//         .then((res) => {
//             console.log(res);
//             pool.end();
//         })
//         .catch((err) => {
//             console.log(err);
//             pool.end();
//         });
// };

// const createBaseInfoTable = () => {
//     const Query = `CREATE TABLE IF NOT EXISTS BaseInfo
//     (id SERIAL PRIMARY KEY,
//     title VARCHAR(500) NOT NULL,
//     value VARCHAR(100) NOT NULL,
//     sort INTEGER ,
//     groupId INTEGER NOT NULL)`;

//     pool.query(Query)
//         .then((res) => {
//             console.log(res);
//             pool.end();
//         })
//         .catch((err) => {
//             console.log(err);
//             pool.end();
//         });
// };

// const createCompanyTable = () => {
//     const Query = `CREATE TABLE IF NOT EXISTS Company
//         (id SERIAL PRIMARY KEY, 
//         Title VARCHAR(300) NOT NULL,
//         Full_Title VARCHAR(300) , 
//         Meli_Code VARCHAR(50) ,
//         Economic_Code VARCHAR(50),
//         Registration_Number VARCHAR(50),
//         Registration_Province_Id INTEGER,
//         Certificate_Type VARCHAR(50),
//         Province_Id INTEGER,
//         City VARCHAR(50),
//         Address VARCHAR(500),
//         PostalCode VARCHAR(50),
//         Tell VARCHAR(50),
//         Fax VARCHAR(50),
//         Rating1 VARCHAR(500),
//         Rating2 VARCHAR(500)
//         )`;

//     pool.query(Query)
//         .then((res) => {
//             console.log(res);
//             pool.end();
//         })
//         .catch((err) => {
//             console.log(err);
//             pool.end();
//         });
// };

// const createTownTable = () => {
//     const Query = `CREATE TABLE IF NOT EXISTS Town(
//         id SERIAL PRIMARY KEY, 
//         Title VARCHAR(500),
//         Province VARCHAR(100),
//         City VARCHAR(100),
//         Gross_Area NUMERIC(18,2), 
//         Pure_Area NUMERIC(18,2),      
//         InitYear VARCHAR(100) ,
//         Activity_Type VARCHAR(100),
//         Ownership_Type VARCHAR(100),      
//         Water_Supply VARCHAR(100),
//         Water_Rate  NUMERIC(18,2),      
//         Power_Supply VARCHAR(100),
//         Power_Rate  NUMERIC(18,2), 
//         Gas_Supply VARCHAR(100),
//         Gas_Rate  NUMERIC(18,2), 
//         Total_Units INTEGER,
//         Used_Units INTEGER,
//         Used_Number INTEGER,
//         Location VARCHAR(100),
//         Coordinate_E NUMERIC(10,6),
//         Coordinate_N NUMERIC(10,7),
//         File_DXF VARCHAR(500),
//         File_KMZ VARCHAR(500)
// )`;


//     pool.query(Query)
//         .then((res) => {
//             console.log(res);
//             pool.end();
//         })
//         .catch((err) => {
//             console.log(err);
//             pool.end();
//         });
// };

// const createProjectTable = () => {
//     const Query = `CREATE TABLE IF NOT EXISTS Project(
//         id SERIAL PRIMARY KEY, 
//         Title VARCHAR(500),
//         full_title VARCHAR(100),
//         town INTEGER
// )`;


//     pool.query(Query)
//         .then((res) => {
//             console.log(res);
//             pool.end();
//         })
//         .catch((err) => {
//             console.log(err);
//             pool.end();
//         });
// };

// const createCantractTable = () => {
//     const Query = `CREATE TABLE IF NOT EXISTS contract
//         (id SERIAL PRIMARY KEY, 
//         Title VARCHAR(300) NOT NULL,
//         Full_Title VARCHAR(300) , 
//         contract_NO VARCHAR(50) ,
//         project_id INTEGER,
//         company_id INTEGER,
//         Colleague1_id INTEGER,
//         Colleague2_id INTEGER,
//         contract_type VARCHAR(50),
//         contract_Date DATE,
//         announcement_date DATE,
//         Land_Delivery_Date DATE,
//         End_Date DATE,
//         Duration INTEGER,
//         Initial_amount bigint,
//         Client_Initial_amount bigint,
//         Coefficient decimal(18,10),
//         file_Agreement VARCHAR(500),
//         file_announcement VARCHAR(500),
//         file_Delivery VARCHAR(500),
//         Project_Manager_Name VARCHAR(500),
//         Project_Manager_Contacts VARCHAR(500)
//         )`;

//     pool.query(Query)
//         .then((res) => {
//             console.log(res);
//             pool.end();
//         })
//         .catch((err) => {
//             console.log(err);
//             pool.end();
//         });
// };

// const createAllTables = () => {

//     createBaseInfoTable();

//     createCompanyTable();
//     createTownTable();
//     createProjectTable();
//     createCantractTable();

// };
//************************************************************************** */

// //create views 
// const createCompanyView = () => {
//     const Query = `CREATE or REPLACE view vw_Company AS
//     select c.*,b1.title as province,b2.title as Registration_Province
//     from company as c join baseinfo as b1 on c.province_id =b1.id
//                       join baseinfo as b2 on c.Registration_Province_id =b2.id`;

//     pool.query(Query)
//         .then((res) => {
//             console.log(res);
//             pool.end();
//         })
//         .catch((err) => {
//             console.log(err);
//             pool.end();
//         });
// };
// const createTwonView = () => {
//     const Query = `CREATE or REPLACE view vw_Company AS
//     select c.*,b1.title as province,b2.title as Registration_Province
//     from company as c join baseinfo as b1 on c.province_id =b1.id
//                       join baseinfo as b2 on c.Registration_Province_id =b2.id`;

//     pool.query(Query)
//         .then((res) => {
//             console.log(res);
//             pool.end();
//         })
//         .catch((err) => {
//             console.log(err);
//             pool.end();
//         });
// };
// const createAllViews = () => {
//     createCompanyView();

// };



// pool.on('remove', () => {
//     console.log('client removed');
//     process.exit(0);
// });


//createAllTables();
//createAllViews();
//createUserTable();

