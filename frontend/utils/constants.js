const { useState, useEffect, useRef, useCallback } = React;
const GOLD = "#c8a96e", DARK = "#c0392b", MID = "#1c1c1c";
const DELIVERY_FEE = 99;
const CANCEL_WINDOW = 180;
const IMG = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&q=80`;
const FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='300'%3E%3Crect width='500' height='300' fill='%23f0ece4'/%3E%3Ctext x='50%25' y='50%25' font-size='48' text-anchor='middle' dy='.3em'%3E%F0%9F%8D%BD%3C/text%3E%3C/svg%3E";

const PROMO_CODES = {
  "RAHUL10":  { type:"percent",  value:10,  label:"10% off" },
  "WELCOME20":{ type:"percent",  value:20,  label:"20% off" },
  "FREESHIP": { type:"freeship", value:99,  label:"Free delivery" },
  "FEAST50":  { type:"flat",     value:500, label:"₹500 flat off" },
};

const menuData = {
  Starters: [
    { name:"Truffle Mushroom Bruschetta", desc:"Wild mushrooms, truffle oil, toasted sourdough", price:"₹1499", img:IMG("photo-1572695157366-5e585ab2b69f"), tag:"Chef's Pick", rating:4.8, reviews:142 },
    { name:"Pan Seared Scallops",         desc:"Cauliflower purée, crispy capers, lemon butter",  price:"₹1999", img:IMG("photo-1559410545-0bdcd187e0a6"), rating:4.9, reviews:218 },
    { name:"Burrata & Heirloom Tomatoes", desc:"Fresh burrata, basil oil, sea salt flakes",        price:"₹1849", img:IMG("photo-1608897013039-887f21d8c804"), rating:4.7, reviews:97 },
    { name:"Foie Gras Terrine",           desc:"Brioche toast, fig jam, micro herbs",              price:"₹2349", img:IMG("photo-1547592180-85f173990554"), tag:"Signature", rating:4.6, reviews:64 },
    { name:"Smoked Salmon Tartare",       desc:"Cucumber gel, dill crème fraîche, rye crisp",     price:"₹1749", img:IMG("photo-1519708227418-c8fd9a32b7a2"), rating:4.7, reviews:113 },
  ],
  "Main Course": [
    { name:"Grilled Tenderloin Steak",  desc:"200g prime beef, seasonal vegetables, red wine jus", price:"₹4349", img:IMG("photo-1558030006-450675393462"), tag:"Best Seller", rating:4.9, reviews:387 },
    { name:"Lobster Thermidor",         desc:"Half lobster, cognac cream sauce, gruyère",          price:"₹5449", img:IMG("photo-1559339352-11d035aa65de"), tag:"Signature",   rating:4.8, reviews:201 },
    { name:"Duck Confit",               desc:"Slow cooked duck leg, cherry sauce, pommes sarladaises", price:"₹3999", img:IMG("photo-1600803907087-f56d462fd26b"), rating:4.7, reviews:155 },
    { name:"Vegetarian Wellington",     desc:"Roasted vegetables, mushroom duxelles, puff pastry", price:"₹3199", img:IMG("photo-1476718406336-bb5a9690ee2a"), tag:"Veg",       rating:4.6, reviews:88 },
    { name:"Pan Roasted Sea Bass",      desc:"Mediterranean sea bass, ratatouille, saffron sauce", price:"₹3699", img:IMG("photo-1519984388953-d2406bc725e1"), rating:4.8, reviews:174 },
    { name:"Rack of Lamb",              desc:"Herb crusted, garlic jus, dauphinoise potatoes",     price:"₹4849", img:IMG("photo-1544025162-d76538645703"), tag:"Chef's Pick",  rating:4.9, reviews:263 },
  ],
  Desserts: [
    { name:"Warm Chocolate Fondant", desc:"Valrhona chocolate, vanilla ice cream, cocoa soil",     price:"₹1349", img:IMG("photo-1578985545062-69928b1d9587"), tag:"Best Seller", rating:4.9, reviews:342 },
    { name:"Classic Crème Brûlée",   desc:"Madagascar vanilla, caramelised sugar crust",           price:"₹1199", img:IMG("photo-1470124182917-cc6e71b22ecc"), rating:4.8, reviews:198 },
    { name:"Mango Panna Cotta",      desc:"Alphonso mango, coconut cream, passionfruit coulis",    price:"₹1249", img:IMG("photo-1488477181946-6428a0291777"), rating:4.7, reviews:122 },
    { name:"Artisan Cheese Board",   desc:"Three curated cheeses, honey, seasonal fruit, crackers",price:"₹1599", img:IMG("photo-1452195100486-9cc805987862"), rating:4.5, reviews:76 },
    { name:"Tarte Tatin",            desc:"Caramelised apple, puff pastry, calvados cream",        price:"₹1249", img:IMG("photo-1562440499-64c9a111f713"), rating:4.6, reviews:91 },
  ],
  Beverages: [
    { name:"Sparkling Water",     desc:"San Pellegrino 750ml",                     price:"₹699",  img:IMG("photo-1559839914-17aae19cec71"), rating:4.4, reviews:32 },
    { name:"House Red Wine",      desc:"Curated Bordeaux selection (glass)",        price:"₹1349", img:IMG("photo-1510812431401-41d2bd2722f3"), rating:4.7, reviews:88 },
    { name:"House White Wine",    desc:"Crisp Chablis or Chardonnay (glass)",      price:"₹1199", img:IMG("photo-1474722883778-792e7990302f"), rating:4.6, reviews:71 },
    { name:"Fresh Pressed Juice", desc:"Orange, Apple, or Mixed Berry",            price:"₹999",  img:IMG("photo-1534353436294-0dbd4bdac845"), rating:4.5, reviews:55 },
    { name:"Artisan Coffee",      desc:"Espresso, Cappuccino, or Flat White",      price:"₹599",  img:IMG("photo-1497515114629-f71d768fd07c"), rating:4.8, reviews:203 },
    { name:"Mocktail of the Day", desc:"Chef's seasonal non-alcoholic creation",   price:"₹949",  img:IMG("photo-1513558161293-cdaf765ed2fd"), rating:4.6, reviews:66 },
  ],
};

const getPrice = item => parseFloat(item.price.replace("₹","").replace(",",""));

const popularityCount = name => {
  let h=0; for(let i=0;i<name.length;i++) h=(h*31+name.charCodeAt(i))>>>0;
  return 8 + (h % 38);
};
