const express = require('express')
const ejs = require('ejs')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const expressLayouts= require('express-ejs-layouts')
const app = express()

let my_data;

//importing database models
const student = require('./model/student_model')
const drive = require('./model/drive_model')

//mongodb atlas connection string
const URI = "mongodb+srv://dm_user123:dm_user123@cluster0.ykkfq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

//mongoose database connection
mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(console.log("Database connected.."))
    .catch(err=> console.log(err));

//setting the view engine
app.set('view engine', 'ejs')

//resolving deprecation warning 
//mongoose.set('useCreateIndex', true);

//middlewares
app.use(express.urlencoded({extended: false}))
app.use(expressLayouts)
app.use('/assets', express.static(__dirname + '/assets'));

//routes
app.get('/home', (req, res) => {
    res.render('home')
})

app.get('/stud_reg', (req, res) => {
    res.render('stud_reg')
})

app.post('/stud_reg', (req, res) => {
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

app.get('/stud_log', (req, res) => {
    res.render('stud_log')
})

app.post('/stud_log', (req, res) => {
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

app.get('/admin_log', (req, res) => {
    res.render('admin_log')
})

//admin credentials
const user_id = "system_admin123@bppimt.com"
const admin_password ="admin123@bppimt"

app.post('/admin_log', (req, res) => {
    let errors = []
    const {email, password} = req.body
    if(!email || !password){
        errors.push({msg: "Please fill all the required fields."})
        res.render('admin_log', {errors})
    }

    if(email===user_id && admin_password===password){
        res.render('admin_home');
    }else{
        errors.push({msg: "Enter the correct credentials.."})
        res.render('admin_log', {errors})
    }
})

app.get('/admin_home', (req, res)=>{
    res.render('admin_home')
})

app.get('/new_drive', (req, res) => {
    res.render('drive_post')
})

app.post('/new_drive', (req, res) => {
    const {drive_id, comp_name, role, salary, perc_criteria, back_criteria, test_date, link} = req.body
    let errors = []
    let message = []
    if(!drive_id || !comp_name || !role || !salary|| !perc_criteria || !back_criteria || !test_date || !link){
        errors.push({msg: "Please fill all the required fields"})
        res.render('drive_post', {errors})
    }else{
        drive.findOne({drive_id:drive_id})
            .then(data =>{
                if( data){
                    errors.push({msg: "This drive already exists"})
                    res.render('drive_post', {errors})
                }else{
                    let new_drive = new drive({
                        drive_id:drive_id,
                        company_name: comp_name,
                        job_role: role,
                        package: salary,
                        perc_criteria: perc_criteria,
                        back_criteria: back_criteria,
                        test_date: test_date,
                        apply_link: link
                    })

                    new_drive.save()
                        .then( data => {
                            message.push({msg: "Drive update succesfully posted!"})
                            res.render('admin_home', {message})
                        })
                        .catch( err => console.log(err))
                }
            })
    }
})

app.get('/stud_home', (req, res)=>{
    const data = my_data
    res.render('stud_home', {data})
})
app.get('/students', (req, res)=>{
    student.find({})
        .then(data =>{
            res.render('students')
        })
        .catch(err => console.log(err))
})

app.get('/students/api', (req, res)=>{
    student.find({})
        .then(data =>{
            res.send({data})
        })
        .catch(err => console.log(err))
})

app.get('/drive_update', (req, res) => {
    drive.find()
        .then(data => {
            res.render('drive_updates', {data})
        })
        .catch(err => console.log(err))
})
// latest routes
// Admin can add students who're already placed!  *will be modified*
app.get('/todoist', (req, res)=> {
    res.render('todoist')
})

app.get('/students/:id', (req, res) => {
    student.findByIdAndDelete({_id: req.params.id})
                .then((data)=> res.redirect("/students"))
                .catch( err => console.log(err))
})

//server listener
app.listen(3000, (req, res) => {
    console.log('Listening on server port: 3000!');
})

