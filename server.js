const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');  //요청데이터 해석을 도와준다
const cors = require('cors');  //이거뭐였는지 확인해보자
const methodOverride = require('method-override')  

app.use(methodOverride('_method'))  // 수정을 위한
app.use(bodyParser.urlencoded({extended : true})) //요청에있는걸 꺼내서 사용하려면 body-parser이라는 라이브러리 사용해야함
app.use(express.json());
app.use(cors());  // 포트넘버가 다르다면 ? cors 사용

const MongoClient = require('mongodb').MongoClient;

var db;  //변수생성 해줘야함

MongoClient.connect('mongodb+srv://covvboi:rla1927@cluster0.lvods.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', function(err,client){
  
  if(err) return console.log(err);
  db = client.db('easel');
})

const http = require('http').createServer(app);
  http.listen(8080, function () {
   console.log('listening on 8080')                                                                     
}); 

app.use( express.static( path.join(__dirname, 'easell/build') ) )

app.get('/', function(req,res){
  res.sendFile( path.join(__dirname, 'easell/build/index.html'))
})

// app.get('/maina', function(req,res){
//   res.sendFile( path.join(__dirname, 'easell/build/index.html'))
// })



////////////////////////////////////////////////////////////////////////////////////
//////////////////////Session 방식 로그인 구현 /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session()); 
//app.use는 요청과 응답사이에 뭔가를 실행하고싶을때! 미들웨어라고 한다.

app.post('/login', passport.authenticate('local',{
  failureRedirect : '/fail'
}), function(req, res){
    res.redirect('/mainin')
    // res.redirect('/maina')
    console.log('성공');
});

app.post('/logout', function(req, res){
  req.logout();
  res.redirect('/')
})

passport.use(new LocalStrategy({
  usernameField: 'id',
  passwordField: 'pw',
  session: true,
  passReqToCallback: false,
}, function (입력한아이디, 입력한비번, done) {
  //console.log(입력한아이디, 입력한비번);
  db.collection('login').findOne({ id: 입력한아이디 }, function (err, result) {
    if (err) return done(err)

    if (!result) return done(null, false, { message: '존재하지않는 아이디' })
    if (입력한비번 == result.pw) {
      return done(null, result)
    } else {
      return done(null, false, { message: '비번틀렸어요' })
    }
  })
}));

// 여기는 세션만들기
//id를 이용해서 세션을 저장시키는 코드(로그인 성공시에 발동)
passport.serializeUser(function(user, done){
  done(null, user.id)
});

//(마이페이지 접속시 발동) 이 세션데이터를 가진 사람을 db에서 찾아주세요 세션을 찾을때 사용함 
passport.deserializeUser(function(아이디, done){
  db.collection('login').findOne({ id : 아이디 },function(err, result){
    done(null, result)
  })
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////// 데이터 보여주는 부분  ////////////////////////// 데이터 보여주는 부분  /////////////////// 데이터 보여주는 부분  /////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// app.get('/view', function(req,res){
//   db.collection('post').find().toArray(function(err, result){
//     res.sendFile( path.join(__dirname, 'easell/build/index.html'))
   
//     res.json(result); // 프론트(클라이언트)에게 응답을 해줌 result값을
//     console.log(result);
    
//   });
// })

/////////////////////// College A/////////////////////////  College A ////////////////////// College A//////////////////////// College A///////////////
app.get('/view1', function(req,res){
  db.collection('collegeA').find().toArray(function(err, result){
    // res.sendFile( path.join(__dirname, 'easell/build/index.html'))
    res.json(result); // 프론트(클라이언트)에게 응답을 해줌 result값을
    // 응답.send(결과)
    console.log(result);
  });
})
////////////////////////////////////댓글1//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/commentview1/:id', function(req,res){
  db.collection('comment').find({ 발행번호 : req.params.id } ).toArray(function(err, result){
    res.json(result);
    console.log(result);
  })
})


/////////////////////// College B/////////////////////////  College B ////////////////////// College B//////////////////////// College B///////////////
app.get('/view2', function(req,res){
  db.collection('collegeB').find().toArray(function(err, result){
    // res.sendFile( path.join(__dirname, 'easell/build/index.html'))
    res.json(result); // 프론트(클라이언트)에게 응답을 해줌 result값을
    // 응답.send(결과)
    console.log(result);
  });
})
////////////////////////////////////댓글2//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/commentview2/:id', function(req,res){
  db.collection('comment').find({ 발행번호 : req.params.id } ).toArray(function(err, result){
    res.json(result);
    console.log(result);
  })
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////// College C/////////////////////////  College C ////////////////////// College C//////////////////////// College C///////////////
app.get('/view3', function(req,res){
  db.collection('collegeC').find().toArray(function(err, result){
    // res.sendFile( path.join(__dirname, 'easell/build/index.html'))
    res.json(result); // 프론트(클라이언트)에게 응답을 해줌 result값을
    // 응답.send(결과)
    console.log(result);
  });
})
////////////////////////////////////댓글3//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/commentview3/:id', function(req,res){
  db.collection('comment').find({ 발행번호 : req.params.id } ).toArray(function(err, result){
    res.json(result);
    console.log(result);
  })
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////// mypage에 로그인한 유저의 게시물만 보이게  College A //////////////////////
app.get('/mypageview1', function(req,res){
  db.collection('collegeA').find({ 세션 : req.user._id }).toArray(function(err, result){
        res.json(result);
        console.log(result);
  })
})
////////////////////////////////////////////////////////////////////////////////////
////////////////// mypage에 로그인한 유저의 게시물만 보이게  College B //////////////////////
app.get('/mypageview2', function(req,res){
  db.collection('collegeB').find({ 세션 : req.user._id }).toArray(function(err, result){
        res.json(result);
        console.log(result);
  })
})
////////////////////////////////////////////////////////////////////////////////////
////////////////// mypage에 로그인한 유저의 게시물만 보이게  College C //////////////////////
app.get('/mypageview3', function(req,res){
  db.collection('collegeC').find({ 세션 : req.user._id }).toArray(function(err, result){
        res.json(result);
        console.log(result);
  })
})
////////////////////////////////////////////////////////////////////////////////////




//////////////TEST///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////// 데이터를 한개만 보이게(findOne) //////////// 데이터를 한개만 보이게(findOne) //////////// 데이터를 한개만 보이게(findOne) //////////// 데이터를 한개만 보이게(findOne) /////////////////
// app.get('/view/:id', function(req,res){
//   db.collection('post').findOne({ _id : parseInt(req.params.id)}, function(err,result){
//     res.sendFile( path.join(__dirname, 'easell/build/index.html'))

//     res.json(result); // 프론트(클라이언트)에게 응답을 해줌 result값을
//     // res.send(result);
//     console.log(result);
//   })
// })
// //////////데이터를 수정///////////////////데이터를 수정///////////////////데이터를 수정///////////////////데이터를 수정///////////////////데이터를 수정///////////////////데이터를 수정/////////
// app.put('/edit',function(req,res){
//   db.collection('post').updateOne({ _id : parseInt(req.body.id)},{ $set : { 작품명 : req.body.title, 작품설명 : req.body.explain, 작가한마디 : req.body.comment}},function(err,result){
//       console.log('수정완료');
//       // res.json(result); 
//       console.log(err);
//       res.send('전송123123완료');
//   })
// })
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////// data update College A //////////////////////// data update College A //////////////////////// data update College A ///////////////
// 데이터를 한개만 보여줌 College A (findOne)
app.get('/mypageview1/:id', function(req,res){
  db.collection('collegeA').findOne({ _id : parseInt(req.params.id)}, function(err,result){
    res.json(result); // 프론트(클라이언트)에게 응답을 해줌 result값을
    // res.send(result);
    console.log(result);
  })
})
////////////////데이터를 수정 College A //////////////////////////데이터를 수정 College A //////////////////////////데이터를 수정 College A ////////////////////
app.put('/edit1',function(req,res){
  db.collection('collegeA').updateOne({ _id : parseInt(req.body.id)},{ $set : { 작품명 : req.body.title, 작품설명 : req.body.explain, 작가한마디 : req.body.comment}},function(err,result){
      console.log('수정완료');
      console.log(err);
      res.redirect('/mypagea')
  })
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////// dataupdate College B //////////////////////// dataupdate College B //////////////////////// dataupdate College B /////////////////
// 데이터를 한개만 보여줌 College B (findOne)
app.get('/mypageview2/:id', function(req,res){
  db.collection('collegeB').findOne({ _id : parseInt(req.params.id)}, function(err,result){
    res.json(result); // 프론트(클라이언트)에게 응답을 해줌 result값을
    console.log(result);
  })
})
////////////////데이터를 수정 College B //////////////////////////데이터를 수정 College B //////////////////////////데이터를 수정 College B ////////////////////
app.put('/edit2',function(req,res){
  db.collection('collegeB').updateOne({ _id : parseInt(req.body.id)},{ $set : { 작품명 : req.body.title, 작품설명 : req.body.explain, 작가한마디 : req.body.comment}},function(err,result){
      console.log('수정완료');
      // res.json(result); 
      console.log(err);
      res.redirect('/mypageb')
  })
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////// dataupdate College C //////////////////////// dataupdate College C //////////////////////// dataupdate College C /////////////////
// 데이터를 한개만 보여줌 College B (findOne)
app.get('/mypageview3/:id', function(req,res){
  db.collection('collegeC').findOne({ _id : parseInt(req.params.id)}, function(err,result){
    // res.sendFile( path.join(__dirname, 'easell/build/index.html'))
    res.json(result); // 프론트(클라이언트)에게 응답을 해줌 result값을
    // res.send(result);
    console.log(result);
  })
})
////////////////데이터를 수정 College C //////////////////////////데이터를 수정 College C //////////////////////////데이터를 수정 College C ////////////////////
app.put('/edit3',function(req,res){
  db.collection('collegeC').updateOne({ _id : parseInt(req.body.id)},{ $set : { 작품명 : req.body.title, 작품설명 : req.body.explain, 작가한마디 : req.body.comment}},function(err,result){
      console.log('수정완료');
      // res.json(result); 
      console.log(err);
      res.redirect('/mypagec')
  })
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




///////// 삭제///////////////// 삭제///////////////// 삭제///////////////// 삭제///////////////// 삭제///////////////// 삭제///////////////// 삭제/////////////
// app.delete('/view', function(req, res){
//   console.log(req.body);
//   db.collection('post').deleteOne(req.body, function(err, result){
//      console.log('삭제완료');
//     //  res.status(200).send({ message : '성공' });
//   })
// })

/////////////////////// College A/////////////////////////  College A ////////////////////// College A//////////////////////// College A///////////////
app.delete('/mypageview1', function(req, res){
  console.log(req.body);
  db.collection('collegeA').deleteOne(req.body, function(err, result){
     console.log('삭제완료');
    //  res.status(200).send({ message : '성공' });
  })
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////// College B/////////////////////////  College B ////////////////////// College B//////////////////////// College B///////////////
app.delete('/mypageview2', function(req, res){
  console.log(req.body);
  db.collection('collegeB').deleteOne(req.body, function(err, result){
     console.log('삭제완료');
    //  res.status(200).send({ message : '성공' });
  })
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////// College C/////////////////////////  College C ////////////////////// College C//////////////////////// College C///////////////
app.delete('/mypageview3', function(req, res){
  console.log(req.body);
  db.collection('collegeC').deleteOne(req.body, function(err, result){
     console.log('삭제완료');
    //  res.status(200).send({ message : '성공' });
  })
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/userinfo', function(req, res){
  console.log(req.user);
  req.user
  res.json(req.user);
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////로그인 성공한 유저만 들어올수있는 페이지 ///////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/maina', 로그인확인, function(req, res){
  console.log(req.user);     //여기는 디시리얼라이즈에서 찾은 결과를 가져온거임
  // res.send(req.user);    // 결과값 보내지말자 아ㅏㅏㅏ 진짜  이거 확인하자 
  res.sendFile( path.join(__dirname, 'easell/build/index.html')) ///  중요
})

app.get('/mainb', 로그인확인, function(req, res){
  console.log(req.user);     //여기는 디시리얼라이즈에서 찾은 결과를 가져온거임
  res.sendFile( path.join(__dirname, 'easell/build/index.html')) ///  중요
})

function 로그인확인(req, res, next){   //미들웨어 부분 
  if(req.user){
    next()
  } else {
    res.send('로그인을하셔야합니다.')
    // res.redirect('/')
  }
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('*', function(req, res){
  res.sendFile( path.join(__dirname, 'easell/build/index.html'))
});



///////////////// img 저장 ///////////////////////

let multer = require('multer');

var storage = multer.diskStorage({
  destination : function(req, file, cb){
    cb(null, './easell/build/image')
  },
  filename : function(req, file, cb){
    cb(null, file.originalname)
  },
  filefilter : function(req, file, cb){
    var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return callback(new Error('PNG, JPG만 업로드하세요'))
        }
        callback(null, true)
    },
    limits:{
        fileSize: 1024 * 1024
  }
});

var upload = multer({storage : storage});

app.get('/image/:imageName', function(req,res){
  res.sendFile( __dirname + '/easell/public/image' + req.params.imageName )
})
///////////////////////////////////////////////////////

////////////////////////// mongodb에 저장하는 부분 ////////////////////////////
// app.post('/add' , function(req,res){   //요청에있는걸 꺼내서 사용하려면 body-parser이라는 라이브러리 사용해야함
      
//       res.redirect('/maina')

//       console.log(req.body);
      
//       db.collection('counter').findOne({name : '게시물갯수'}, function(err,result){
//         var 총게시물갯수 = result.totalPost;
        
//         db.collection('post').insertOne({ _id : 총게시물갯수 + 1 ,작품명: req.body.title , 작품설명: req.body.explain, 작가한마디: req.body.comment}, function(err,result){
//           console.log('저장완료fasdf');
          
          
//           db.collection('counter').updateOne({name : '게시물갯수'},{ $inc : {totalPost:1 }},function(err,result){
//             if(err){return console.log(에러)}
            
//           })  
//         })
        
//       })
//     })
    

    
    
    
    /////////College A Post ///////////////////College A Post ///////////////////College A Post ///////////////////College A Post ///////////
    app.post('/add1' , upload.single('작품') ,function(req,res){   //요청에있는걸 꺼내서 사용하려면 body-parser이라는 라이브러리 사용해야함
      // res.send('전송완료');
      res.redirect('/maina')
      
      console.log(req.body);
      
      db.collection('counter').findOne({name : '게시물갯수'}, function(err,result){
        var 총게시물갯수 = result.totalPost;
        
        db.collection('collegeA').insertOne({ _id : 총게시물갯수 + 1 ,세션: req.user._id, img: req.file.originalname, 작품명: req.body.title, 작품설명: req.body.explain, 작가한마디: req.body.comment, nowimg: req.user.userimg, nownickname: req.user.nickname }, function(err,result){
          console.log('저장완료');
          
          
          db.collection('counter').updateOne({name : '게시물갯수'},{ $inc : {totalPost:1 }},function(err,result){
            if(err){return console.log(에러)}
            
          })
        })
        
      })   
    })
    
    app.post('/comment1', function(req, res){    
      db.collection('comment').insertOne({발행번호: req.body.postnum,  댓글: req.body.comments}, function(err, result){
        console.log('저장완료');
        res.redirect('/maina')
    
      })
    })



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////???
app.put('/profile1', function(req,res){
  db.collection('login').updateOne( { $set : { 프로필이미지 : parseInt(req.body.프로필이미지)}},function(err,result){

    console.log('수정완료');
    res.redirect('/mypagea')

  })
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////???





//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////College B ////////////////////College B ////////////////////College B ////////////////////College B ////////////////////College B ///////////
app.post('/add2', upload.single('작품'), function(req,res){   //요청에있는걸 꺼내서 사용하려면 body-parser이라는 라이브러리 사용해야함
  // res.send('전송완료');
  res.redirect('/mainb')

  console.log(req.body);

  db.collection('counter').findOne({name : '게시물갯수'}, function(err,result){
    var 총게시물갯수 = result.totalPost;

      db.collection('collegeB').insertOne({ _id : 총게시물갯수 + 1 ,세션: req.user._id, img: req.file.originalname, 작품명: req.body.title, 작품설명: req.body.explain, 작가한마디: req.body.comment, nowimg: req.user.userimg, nownickname: req.user.nickname }, function(err,result){
        console.log('저장완료');

        db.collection('counter').updateOne({name : '게시물갯수'},{ $inc : {totalPost:1 }},function(err,result){
          if(err){return console.log(에러)}

        })
      })

  })
})

app.post('/comment2', function(req, res){    
  db.collection('comment').insertOne({발행번호: req.body.postnum,  댓글: req.body.comments}, function(err, result){
    console.log('저장완료');
    res.redirect('/mainb')

  })
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





/////////College C ////////////////////College C ////////////////////College C ////////////////////College C ////////////////////College C ///////////
app.post('/add3', upload.single('작품'), function(req,res){   //요청에있는걸 꺼내서 사용하려면 body-parser이라는 라이브러리 사용해야함
  // res.send('전송완료');
  res.redirect('/mainc')

  console.log(req.body);

  db.collection('counter').findOne({name : '게시물갯수'}, function(err,result){
    var 총게시물갯수 = result.totalPost;

      db.collection('collegeC').insertOne({ _id : 총게시물갯수 + 1 ,세션: req.user._id, img: req.file.originalname, 작품명: req.body.title, 작품설명: req.body.explain, 작가한마디: req.body.comment, nowimg: req.user.userimg, nownickname: req.user.nickname }, function(err,result){
        console.log('저장완료');

        db.collection('counter').updateOne({name : '게시물갯수'},{ $inc : {totalPost:1 }},function(err,result){
          if(err){return console.log(에러)}

        })
      })

  })
})

app.post('/comment3', function(req, res){    
  db.collection('comment').insertOne({발행번호: req.body.postnum,  댓글: req.body.comments}, function(err, result){
    console.log('저장완료');
    res.redirect('/mainc')

  })
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





/////// mongodb에 회원가입 정보 저장하는 부분 ////////
app.post('/add/2', upload.single('프로필'),function(req, res){

  // res.send('전송완료');

  db.collection('login').insertOne({ id: req.body.id ,pw: req.body.pw, email: req.body.email, nickname: req.body.nickname, userimg: req.file.originalname}, function(err, result){
    console.log(result);
    console.log('회원가입완료');
    res.redirect('/')
  })
})




//////////////이메일 인증번호 보내주기 //////////////

const nodemailer = require('nodemailer');
var randomnum = Math.random().toString(36).slice(7);

app.get('/innum', function(req, res){
  // req.json(results)
  // res.json(result);
  res.json(randomnum);
  
} )

app.post('/uniin', function(req, res){

  
   let data = req.body
   let innum = req.body
   let checkmail = randomnum;
   let test2 = "안녕하세요"
   
   const results = {
     message : checkmail,
     code : 2
   };
 

   const mailTransporter = nodemailer.createTransport({
     service: "gmail",
     auth:{
       user: "rlgjs34@gmail.com",
       pass: "rla138604!"
      } 
    })
    
    const details = {
      from: "rlgjs34@gmail.com",
      to: data.email, 
      subject: " EASEL 인증번호입니다. ",
      text: randomnum
    } 
    
    mailTransporter.sendMail(details, function(err, result) {
      
      
      if (err) {
        console.log("에러", err);
      }
      else {
        console.log('email has send!');
        console.log(randomnum);
        console.log(checkmail);
        console.log(test2);
        console.log(results);
        res.send(results);
        // res.send("test2");
        mailTransporter.close()
      }
      
      
      // if (randomnum == innum.innum) {
        //   console.log('인증성공');
          // } else {
          //   console.log('인증실패');
          // }

        })
     
     
      
      
})
  /////////////////////////////////