-- CREATE TABLE IF NOT EXISTS public.admin (
--         id SERIAL NOT NULL,
--         email text ,    
--         password text ,
--         createdAt timestamp,
--         updatedAt timestamp ,
--         PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.User (
        id SERIAL NOT NULL,
        username text,
        email   text,
        password text,
        image   text ,
        status text,
        role text,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.otp (
            id SERIAL,
            email text,
            otp text,
            status text,
            createdAt timestamp NOT NULL,
            updatedAt timestamp ,
            PRIMARY KEY (id));


CREATE TABLE IF NOT EXISTS public.membership (
        id SERIAL NOT NULL,
        registration_date timestamp,
        parent_id text ,
        email text,
        full_name text,
        call text ,
        gender text ,
        telephone text,
		profession text,
		age text,
		date_of_birth text,
		marital_status  text,
		no_of_children text,
		childrens_age text,
		living_area text,
		schedule text,
		language text,
		introducer text,
		best_contact_time  text,
		membership_level text,
		participant_remarks text, 
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.relationship (
        id SERIAL NOT NULL,
        registration_date timestamp,
        relationship_number text ,
        participant_number text,
        participant_relations text[],
        relationship_name text ,
        telephone_number text ,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.customer_relation (
        id SERIAL NOT NULL,
        full_name text,
        call text ,
        telephone text,
        gender text,
        review text ,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.event (
        id SERIAL NOT NULL,
        name text,
        location text ,
        date text,
        time text,
        deadline timestamp ,
        activity_cost text,
        payment_date text,
        event_status text,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));


CREATE TABLE IF NOT EXISTS public.eventregistration (
        id SERIAL NOT NULL,
        event_id SERIAL NOT NULL,
        participation_date text ,
        participation_time text,
        parent_id SERIAL NOT NULL,
        full_name text ,
        telephone text,
        call text,
        payment_date text,
        payment_method text,
        payment_amount text,
        payee text,
        payment_status text,
        remarks text,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));



CREATE TABLE IF NOT EXISTS public.donation_record (
        id SERIAL NOT NULL,
        parent_id SERIAL NOT NULL,
        full_name text ,
        call text,
        telephone text,
        donation_method text ,
        donation_amount text,
        donation_date text,
        principal text,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.basic_settings (
        id SERIAL NOT NULL,
        company_name text,
        description text ,
        invoice_prefix  text,
        time_format  text,
        logo  text,
        favourite_icon  text,
        createdAt timestamp ,
        updatedAt timestamp  ,
        PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.email_template (
        id SERIAL NOT NULL,
        features text[],
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS public.membership_level (
        id SERIAL NOT NULL,
        level text,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));


CREATE TABLE IF NOT EXISTS public.email_settings (
        id SERIAL NOT NULL,
        mail_driver text,
        mail_host text ,
        mail_port text,
        mail_username text,
        mail_password text ,
        mail_encryption text,
        mail_from_address text,
        mail_from_name text,
        createdAt timestamp,
        updatedAt timestamp ,
        PRIMARY KEY (id));

