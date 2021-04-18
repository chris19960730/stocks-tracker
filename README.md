# stocks-tracker

## Author
[Haocheng Yang](https://github.com/chris19960730)

[Ziqi Xu](https://github.com/MARVELOUSbear)


## Project Objective
 This is a personal stock tracker. It consists of 4 parts: **authentication**(register/login), **stock watchlist**, **friend lists**, and **profile management**. 

Users can search for stocks by stock symbol ticker, add them to their watchlist, and remove unwanted stocks. They can also search for register users by email and view their profile and stock watchlist. Users can view and update their own profile as well.


## Screenshot
 ![screenshot](https://github.com/chris19960730/stocks-tracker/blob/main/public/images/screenshot/watchlist.png)
 
## Tech requirements
- bcrypt
- dotenv
- express
- express-session
- mongodb
- node-fetch
- node-iex-cloud

## How to install/use locally
- Clone this repo and run `npm -install` 
- Register an account at [https://iexcloud.io/](https://iexcloud.io/) and create an api key.
- Create an **.env** file in the root directory of this project and include the api key in it.
- Keep your mongodb running
- Run `npm start`  or `nodemon app.js`


## Reference to the class
[CS5610](https://johnguerra.co/classes/webDevelopment_spring_2021/)

## Link to the video demonstration
[demonstration video](https://www.youtube.com/watch?v=reXtSRA3Am8)

## Demo Link
[https://stock-trackerrr.herokuapp.com/](https://stock-trackerrr.herokuapp.com/)

## Google Slides
[Slides](https://docs.google.com/presentation/d/1cJzlyZRVlXcxBfDsXMVhZEf_wJp8noep_ds_MsZIl6E/edit#slide=id.p)

## MIT License
[MIT License](https://github.com/chris19960730/stocks-tracker/blob/main/LICENSE)

## Release
[Release](https://github.com/chris19960730/stocks-tracker/releases/tag/v1.0)
