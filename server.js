const express = require('express');
const app = express();
const db = require('quick.db')
const bodyParser = require('body-parser')
var flash = require('express-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');


app.use(express.static('public'));

app.use(cookieParser());
app.use(bodyParser.urlencoded({
 extended: true
}));

app.use(session({
  secret: "carlosecretloljesuckt",
  resave: false,
  saveUninitialized: true
}))

app.use(flash());
app.use(express.static(__dirname + "/views"));
app.set('view engine', 'ejs');
app.set("views", "./views");
app.use("/static", express.static("./static"));

app.get('/', function(req, res) {
  res.render(__dirname + '/views/index.ejs');
});

app.get('/:id', function(req, res, next) {
  let id = req.params.id
  if(!db.has(id)) {
    req.flash('error', 'Hatalı bir kod yada sayfa girdiniz.')
    res.redirect('/')
  } else {
      res.redirect(db.get(id))
  }
});

app.post('/newlink', function(req, res) {
  let body = req.body
  if(!body) {
    req.flash('error', 'Lütfen bir link giriniz.')
    res.redirect('/')
  } else {
    console.log(isValidUrl(body.link))
    if(isValidUrl(body.link)) {
      let id = makeid(6)
      console.log('||  '+ body.link + "      ->      "+ "https://url-kisalt.tk/"+id+'  ||')
      db.set(id, body.link)
      req.flash('success', `${id}`)
      res.redirect('/')
    } else {
      req.flash('error', 'Lütfen düzgün bir link eklemeyi deneyiniz.')
      res.redirect('/')
    }
  }
})

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

function makeid(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

const isValidUrl = (string) => {
  var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  if(!regex.test(string)) {
    return false;
  } else {
    return true;
  }
}