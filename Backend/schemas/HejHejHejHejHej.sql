--
-- PostgreSQL database dump
--

\restrict ve4bVWdzVdW5zJ3QaahrQ92TC2ih7y4EBWopnlt5o0c7Yqrcng614Xf9gUcdchS

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.0

-- Started on 2026-02-03 15:48:31

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 872 (class 1247 OID 16579)
-- Name: order_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_status AS ENUM (
    'Sent',
    'Delivered',
    'In basket'
);


ALTER TYPE public.order_status OWNER TO postgres;

--
-- TOC entry 860 (class 1247 OID 16519)
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'Admin',
    'Customer',
    'Owner'
);


ALTER TYPE public.user_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 227 (class 1259 OID 16602)
-- Name: orderline; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orderline (
    orderline_id integer NOT NULL,
    user_id integer,
    product_id integer,
    amount integer NOT NULL,
    price_at_purchase double precision NOT NULL,
    order_id integer
);


ALTER TABLE public.orderline OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16601)
-- Name: orderline_orderline_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orderline_orderline_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orderline_orderline_id_seq OWNER TO postgres;

--
-- TOC entry 4972 (class 0 OID 0)
-- Dependencies: 226
-- Name: orderline_orderline_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orderline_orderline_id_seq OWNED BY public.orderline.orderline_id;


--
-- TOC entry 225 (class 1259 OID 16586)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    order_id integer NOT NULL,
    user_id integer,
    "time" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status public.order_status DEFAULT 'In basket'::public.order_status
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16585)
-- Name: orders_order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_order_id_seq OWNER TO postgres;

--
-- TOC entry 4973 (class 0 OID 0)
-- Dependencies: 224
-- Name: orders_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.orders.order_id;


--
-- TOC entry 221 (class 1259 OID 16545)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    product_id integer NOT NULL,
    name character varying(255),
    image_url text,
    image_count integer,
    category_id integer,
    group_id integer,
    ext_number character varying(50),
    ext_rarity character varying(100),
    ext_card_type character varying(100),
    ext_hp integer,
    ext_stage character varying(100),
    ext_attack1 text,
    ext_attack2 text,
    ext_weakness character varying(100),
    ext_resistance character varying(100),
    ext_retreat_cost integer,
    ext_card_text text,
    sub_type_name character varying(100),
    price double precision,
    stock integer,
    creation_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16555)
-- Name: reviewlines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviewlines (
    review_id integer NOT NULL,
    parent_id integer,
    product_id integer,
    grade integer,
    user_id integer,
    comment character varying(255),
    date date DEFAULT CURRENT_DATE
);


ALTER TABLE public.reviewlines OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16554)
-- Name: reviewlines_review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviewlines_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviewlines_review_id_seq OWNER TO postgres;

--
-- TOC entry 4974 (class 0 OID 0)
-- Dependencies: 222
-- Name: reviewlines_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviewlines_review_id_seq OWNED BY public.reviewlines.review_id;


--
-- TOC entry 220 (class 1259 OID 16526)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    role public.user_role DEFAULT 'Customer'::public.user_role NOT NULL,
    password text NOT NULL,
    birth_date date,
    creation_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    deliveryplace text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16525)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 4975 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 4789 (class 2604 OID 16605)
-- Name: orderline orderline_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderline ALTER COLUMN orderline_id SET DEFAULT nextval('public.orderline_orderline_id_seq'::regclass);


--
-- TOC entry 4786 (class 2604 OID 16589)
-- Name: orders order_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);


--
-- TOC entry 4784 (class 2604 OID 16558)
-- Name: reviewlines review_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviewlines ALTER COLUMN review_id SET DEFAULT nextval('public.reviewlines_review_id_seq'::regclass);


--
-- TOC entry 4780 (class 2604 OID 16529)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 4966 (class 0 OID 16602)
-- Dependencies: 227
-- Data for Name: orderline; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orderline (orderline_id, user_id, product_id, amount, price_at_purchase, order_id) FROM stdin;
\.


--
-- TOC entry 4964 (class 0 OID 16586)
-- Dependencies: 225
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (order_id, user_id, "time", status) FROM stdin;
\.


--
-- TOC entry 4960 (class 0 OID 16545)
-- Dependencies: 221
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (product_id, name, image_url, image_count, category_id, group_id, ext_number, ext_rarity, ext_card_type, ext_hp, ext_stage, ext_attack1, ext_attack2, ext_weakness, ext_resistance, ext_retreat_cost, ext_card_text, sub_type_name, price, stock, creation_date) FROM stdin;
\.


--
-- TOC entry 4962 (class 0 OID 16555)
-- Dependencies: 223
-- Data for Name: reviewlines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviewlines (review_id, parent_id, product_id, grade, user_id, comment, date) FROM stdin;
\.


--
-- TOC entry 4959 (class 0 OID 16526)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, username, email, role, password, birth_date, creation_date, deliveryplace) FROM stdin;
\.


--
-- TOC entry 4976 (class 0 OID 0)
-- Dependencies: 226
-- Name: orderline_orderline_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orderline_orderline_id_seq', 1, false);


--
-- TOC entry 4977 (class 0 OID 0)
-- Dependencies: 224
-- Name: orders_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_order_id_seq', 1, false);


--
-- TOC entry 4978 (class 0 OID 0)
-- Dependencies: 222
-- Name: reviewlines_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviewlines_review_id_seq', 1, false);


--
-- TOC entry 4979 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 1, false);


--
-- TOC entry 4803 (class 2606 OID 16610)
-- Name: orderline orderline_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderline
    ADD CONSTRAINT orderline_pkey PRIMARY KEY (orderline_id);


--
-- TOC entry 4801 (class 2606 OID 16595)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- TOC entry 4797 (class 2606 OID 16553)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);


--
-- TOC entry 4799 (class 2606 OID 16562)
-- Name: reviewlines reviewlines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviewlines
    ADD CONSTRAINT reviewlines_pkey PRIMARY KEY (review_id);


--
-- TOC entry 4791 (class 2606 OID 16544)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4793 (class 2606 OID 16540)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4795 (class 2606 OID 16542)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4808 (class 2606 OID 16621)
-- Name: orderline orderline_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderline
    ADD CONSTRAINT orderline_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id);


--
-- TOC entry 4809 (class 2606 OID 16616)
-- Name: orderline orderline_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderline
    ADD CONSTRAINT orderline_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- TOC entry 4810 (class 2606 OID 16611)
-- Name: orderline orderline_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderline
    ADD CONSTRAINT orderline_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 4807 (class 2606 OID 16596)
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 4804 (class 2606 OID 16563)
-- Name: reviewlines reviewlines_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviewlines
    ADD CONSTRAINT reviewlines_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.reviewlines(review_id);


--
-- TOC entry 4805 (class 2606 OID 16568)
-- Name: reviewlines reviewlines_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviewlines
    ADD CONSTRAINT reviewlines_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- TOC entry 4806 (class 2606 OID 16573)
-- Name: reviewlines reviewlines_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviewlines
    ADD CONSTRAINT reviewlines_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


-- Completed on 2026-02-03 15:48:31

--
-- PostgreSQL database dump complete
--

\unrestrict ve4bVWdzVdW5zJ3QaahrQ92TC2ih7y4EBWopnlt5o0c7Yqrcng614Xf9gUcdchS

