const express = require('express')
const router = express.Router


router.get('/stud_reg', (req, res) => {
    res.render('stud_reg')
})

router.post('/stud_reg', (req, res) => {
    const {name,streams,backs,ssc_perc,hsc_perc,grad_perc,email,password,password2}=req.body;
    let errors= [];

    //Validation
    //check required fields
    if(!name || !email || !password || !password2 || !backs || !ssc_perc || !hsc_perc || !grad_perc){
        errors.push({msg:"Please fill all the required fields."})
    }

    //check passwords match
    if(password!==password2){
        errors.push({msg: 'Passwords do not match.'})
    }

    //check pass len
    if(password.length<6){
        errors.push({msg:`Password must'be of 6 characters.` })
    }

    if(errors.length>0){
      res.render('stud_reg', {errors})
    } else {
      student.findOne({ email: email })
      .then(user => {
        if (user) {
          errors.push({ msg: 'Email already exists' })
          
          res.render('stud_reg', {errors})

        } else {
          const newUser = new student({
            name: name,
            stream: streams,
            backlog: backs,
            ssc_perc: ssc_perc,
            hsc_perc: hsc_perc,
            grad_perc: grad_perc,
            email: email,
            password: password
          });
          newUser
            .save()
            .then(user => {
              res.redirect('/stud_log');
            })
            .catch(err => console.log(err));
        }
      });
    }
})

router.get('/stud_log', (req, res) => {
    res.render('stud_log')
})

router.post('/stud_log', (req, res) => {
    let errors= []
    const {email, password} = req.body
    
    if(!email || !password){
        errors.push({msg:"Please fill all the required fields."})
        res.render('stud_log', {errors})
    }else{
        student.findOne({email:email})
            .then(data =>{
                if(!data){
                    errors.push({msg: "Email address is not registered.."})
                    res.render('stud_log', {errors})
                }
                if(data.password==password){
                    my_data = data
                    res.render('stud_home', {data})
                }else{
                    errors.push({msg: "Wrong password"})
                    res.render('stud_log', {errors})
                }
            })
            .catch( err => console.log(err))
    }
})

module.exports = router