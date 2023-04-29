let app = new Vue({
    el: '#loginApp',
    data() {
        return {
            title: "Login Page",
            loginPage: true,
            userName: '',
            showCourses: false,
            password: '',
            moduleName:'',
            moduleCode:'',
            moduleYear:0,
            moduleOptional:"",
            moduleSkill1:'',
            moduleSkill2:'',
            moduleSkill3:'',
            moduleSkill4:'',
            moduleSkill5:'',
            courseName: '',
            courseCode: '',
            courseId: 0,
            courseType: '',
            feed: '',
            credentials: [],
            moduleEdit:false,
            courseEdit: false,
            courseAdd: false,
            moduleShow: false,
            courses: [],
            allModules:[],
            modules:[],
            moduleId:0,
            moduleAdd:false,
            feeds: '',
        }
    },
    created: async function () {

        let credentialResult = await axios.get("https://cvbuildproject-env.eba-pzdzkfze.eu-west-2.elasticbeanstalk.com/credentials");
        this.getCourses();
        this.getModules();
        this.credentials = credentialResult.data;
        if (localStorage.cvrecord) {
            this.loginPage = false;
            this.title = "Courses Details";
            let myArray = JSON.parse(localStorage.cvrecord);
            this.userName = myArray[0].username;
            this.showCourses = true;
        }

    },
    methods: {
        logout:function(){
            localStorage.removeItem("cvrecord");
            location.reload();

        },
        editModule(course){
            this.moduleShow=false;
            this.moduleEdit=true;
            this.title = "Edit Module Details";
            let appp=this;
            appp.moduleName = course.code;
            appp.moduleCode = course.name;
            appp.moduleYear = course.year;
            appp.moduleOptional = course.optional;
            appp.moduleSkill1 = course.skill1;
            appp.moduleSkill2 = course.skill2;
            appp.moduleSkill3 = course.skill3;
            appp.moduleSkill4 = course.skill4;
            appp.moduleSkill5 = course.skill5;
            appp.moduleId = course.id;



        },

        removeModule(course){

            let ans = window.confirm("Do you want to remove the Module ?");
            if (ans) {
                this.feed = "";
                let appp = this;
                axios.post('https://cvbuildproject-env.eba-pzdzkfze.eu-west-2.elasticbeanstalk.com/removeModule', {
                    code: course.name,
                })
                    .then(async function (response) {
                        await appp.getModules();
                        appp.modules=[];
                        appp.allModules.forEach(dat=>{
                            if(dat.title_id==appp.courseId){
                                appp.modules.push(dat);
                            }
                        })

                        appp.feeds = "Module has been removed";
                        setTimeout(function () {
                            appp.feeds = "";
                        }, 5000);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });


            }
            else{}
                    },

        addCourse() {
            this.showCourses = false;
            this.moduleEdit=false;
            this.title = "Add New Course";
            this.courseAdd = true;
        },
        newCourse() {

            if (this.courseName !== "" && this.courseCode !== "" && this.courseType !== "") {

                let high = 0;
                let found = false;
                this.courses.forEach(dat => {
                    if (dat.id > high) {
                        high = dat.id;
                    }
                    if ((dat.name == this.courseName || dat.code == this.courseCode) && dat.type == this.courseType) {
                        found = true;
                    }
                })
                if (found == true) {
                    this.feed = "Either course name or code already exists";
                } else {
                    this.showCourses = true;
                    this.courseAdd = false;
                    this.feed="";
                    let appp = this;
                    axios.post('https://cvbuildproject-env.eba-pzdzkfze.eu-west-2.elasticbeanstalk.com/addCourse', {
                        name: this.courseName,
                        code: this.courseCode,
                        type: this.courseType,
                        id: high + 1,
                    })
                        .then(async function (response) {
                            await appp.getCourses();
                            appp.feeds = "Course has been added";
                            this.courseName="";
                            this.courseCode="";
                            this.courseType="";
                            setTimeout(function () {
                                appp.feeds = "";
                            }, 5000);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });

                }
            } else {
                this.feed = "Please fill in all details";
            }


        },
        newModule(){
            if (this.moduleName !== "" && this.moduleCode !== "" && this.moduleYear !== "" && this.moduleYear!== 0 && this.moduleOptional!=="" ) {
                let high = 0;
                let found = false;
                this.allModules.forEach(dat => {
                    if (dat.id > high) {
                        high = dat.id;
                    }
                })
                let compulsoryCount = 0;
                this.modules.forEach(dat => {

                    if ((dat.code == this.moduleName || dat.name == this.moduleCode)) {
                        found = true;
                    }
                    if (dat.year == this.moduleYear && dat.optional == "N") {
                        compulsoryCount = compulsoryCount + 1;
                    }
                })
                if (this.moduleOptional == "N" && compulsoryCount >= 4) {
                    this.feed = "Sorry you can only have 4 compulsory modules in specific year"

                }
                else{

                if (found == true) {
                    this.feed = "Either module name or code already exists";
                } else {
                    this.moduleShow = true;
                    this.moduleAdd = false;
                    this.feed = "";
                    let appp = this;
                    axios.post('https://cvbuildproject-env.eba-pzdzkfze.eu-west-2.elasticbeanstalk.com/addModule', {
                        name: this.moduleName,
                        code: this.moduleCode,
                        year: this.moduleYear,
                        optional: this.moduleOptional,
                        title_id: this.courseId,
                        skill1: this.moduleSkill1,
                        skill2: this.moduleSkill2,
                        skill3: this.moduleSkill3,
                        skill4: this.moduleSkill4,
                        skill5: this.moduleSkill5,
                        id: high + 1,
                    })
                        .then(async function (response) {
                            await appp.getModules();
                            appp.modules=[];
                            appp.allModules.forEach(dat=>{
                                if(dat.title_id==appp.courseId){
                                    appp.modules.push(dat);
                                }
                            })

                            appp.feeds = "Module has been added";
                            appp.moduleName = "";
                            appp.moduleCode = "";
                            appp.moduleYear = "";
                            appp.moduleOptional = "";
                            appp.moduleSkill1 = "";
                            appp.moduleSkill2 = "";
                            appp.moduleSkill3 = "";
                            appp.moduleSkill4 = "";
                            appp.moduleSkill5 = "";
                            appp.moduleId = "";
                            setTimeout(function () {
                                appp.feeds = "";
                            }, 5000);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });



                }
            }





            }
            else{
                this.feed="Please fill all details";
            }
        },
        saveCourse: function () {
            if (this.courseName !== "" && this.courseCode !== "" && this.courseType!="") {


                let found = false;
                this.courses.forEach(dat => {
                    if (dat.id !== this.courseId) {
                        if ((dat.name == this.courseName || dat.code == this.courseCode) && dat.type == this.courseType) {
                            found = true;
                        }
                    }

                })
                if (found == true) {
                    this.feed = "Either module name or code already exists";
                } else {
                    this.showCourses = true;
                    this.courseEdit = false;
                    this.title = "Courses Details";
                    let appp = this;

                    axios.post('https://cvbuildproject-env.eba-pzdzkfze.eu-west-2.elasticbeanstalk.com/updateCourse', {
                        name: this.courseName,
                        code: this.courseCode,
                        type: this.courseType,
                        id: this.courseId
                    })
                        .then(async function (response) {
                            await appp.getCourses();
                            appp.feeds = "Course has been updated";
                            this.courseName = "";
                            this.courseCode = "";
                            this.courseType = "";
                            setTimeout(function () {
                                appp.feeds = "";
                            }, 5000);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }
            }else{
                this.feed="Please fill in all details";
            }
        },
        saveModule() {
            if (this.moduleName !== "" && this.moduleCode !== "" && this.moduleYear !== 0 && this.moduleOptional!== "") {
            let found = false;
            this.modules.forEach(dat => {
                if (dat.id !== this.moduleId) {
                    if ((dat.code == this.moduleName || dat.name == this.moduleCode)) {
                        found = true;
                    }
                }

            })
            if (found == true) {
                this.feed = "Either module name or code already exists";
            } else {
                this.moduleShow = true;
                this.moduleEdit = false;
                this.title = "Module Details";
                let appp = this;

                axios.post('https://cvbuildproject-env.eba-pzdzkfze.eu-west-2.elasticbeanstalk.com/updateModule', {
                    name: this.moduleName,
                    code: this.moduleCode,
                    year: this.moduleYear,
                    optional: this.moduleOptional,
                    title_id: this.courseId,
                    skill1: this.moduleSkill1,
                    skill2: this.moduleSkill2,
                    skill3: this.moduleSkill3,
                    skill4: this.moduleSkill4,
                    skill5: this.moduleSkill5,
                    id: this.moduleId,
                })
                    .then(async function (response) {
                        await appp.getModules();
                        appp.modules=[];
                        appp.allModules.forEach(dat=>{
                            if(dat.title_id==appp.courseId){
                                appp.modules.push(dat);
                            }
                        })

                        appp.feeds = "Module has been updated";
                        appp.moduleName = "";
                        appp.moduleCode = "";
                        appp.moduleYear = "";
                        appp.moduleOptional = "";
                        appp.moduleSkill1 = "";
                        appp.moduleSkill2 = "";
                        appp.moduleSkill3 = "";
                        appp.moduleSkill4 = "";
                        appp.moduleSkill5 = "";
                        appp.moduleId = "";
                        setTimeout(function () {
                            appp.feeds = "";
                        }, 5000);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        }else{
            this.feed="Please fill all details";
        }

        },
        saveCancel() {
            this.showCourses = true;
            this.courseEdit = false;
            this.courseAdd = false;
            this.courseName = "";
            this.courseCode = "";
            this.courseType = "";
            this.courseId = "";
            this.feed = "";
            this.title="Courses Details";
        },
        saveModuleCancel() {
            this.moduleShow = true;
            this.moduleEdit = false;
            this.moduleAdd = false;
            this.moduleName = "";
            this.moduleCode = "";
            this.moduleOptional="";
            this.moduleYear = "";
            this.moduleSkill1 = "";
            this.moduleSkill2 = "";
            this.moduleSkill3= "";
            this.moduleSkill4 = "";
            this.moduleSkill5 = "";
            this.moduleId = "";

            this.feed = "";
            this.title="Module Details";
        },
        editCourse(course) {
            this.showCourses = false;
            this.courseEdit = true;
            this.courseName = course.name;
            this.courseCode = course.code;
            this.courseType = course.type;
            this.title = "Edit Course Details";
            this.courseId = course.id;


        },
        removeCourse(course) {
            let ans = window.confirm("Do you want to remove the course ? It will remove all modules associated with it.");
            if (ans) {
                this.feed = "";
                let appp = this;
                let tempModules=[];
                this.allModules.forEach(dat=>{
                   if(dat.title_id==course.id){
                       tempModules.push(dat);
                   }
                });
                axios.post('https://cvbuildproject-env.eba-pzdzkfze.eu-west-2.elasticbeanstalk.com/removeCourse', {
                    code: course.code,
                    modules:tempModules,
                }).then(async function (response) {
                        await appp.getCourses();
                        appp.feeds = "Course has been deleted";

                        setTimeout(function () {
                            appp.feeds = "";
                        }, 5000);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            } else {
            }


        },

        getOptional(code){
            if(code=="N"){
                return "Compulsory Module";
            }
            else{
                return "Optional Module";
            }
            return "";

        },
        detailCourse:async function (course) {
            this.showCourses=false;
            this.moduleShow=true;
            this.title="Module Details";
            this.modules=[];
             await this.getModules();
            this.allModules.forEach(dat=>{
                if(dat.title_id==course.id){
                this.modules.push(dat);
                }
            })
            this.courseId=course.id;

        },
        addModules(){
         this.moduleShow=false;
         this.moduleAdd=true;
         this.title="Add Modules";

        },
        gotToCourses(){
          this.title="Courses Details";
            this.showCourses=true;
            this.moduleShow=false;
            this.feed="";

        },
        loginCheck() {
            if (this.userName !== undefined && this.password !== undefined && this.userName !== "" && this.password !== "") {
                let found = false;
                this.credentials.forEach(dat => {
                    if (dat.username == this.userName && dat.password == this.password) {

                        let myObj = {"username": this.userName, "password": this.password};
                        let myArray = [];
                        myArray.push(myObj);
                        localStorage.cvrecord = JSON.stringify(myArray);
                        this.feed = '';
                        found = true;
                        this.loginPage = false;
                        this.title = "Courses Details";
                        this.showCourses=true;

                    }
                })
                if (found == false) {
                    this.feed = "Invalid Credentials";
                }
            } else {
                this.feed = "Please fill all the credentials";
            }
        },



        getCourses: async function () {
            let corsesResult = await axios.get("https://cvbuildproject-env.eba-pzdzkfze.eu-west-2.elasticbeanstalk.com/courses");
            this.courses = corsesResult.data;
        },
        getModules: async function () {
            let corsesResult = await axios.get("https://cvbuildproject-env.eba-pzdzkfze.eu-west-2.elasticbeanstalk.com/modules");
            this.allModules = corsesResult.data;
            this.allModules.sort(function (a, b) {
                if (b.year > a.year)
                    return -1;
                if (b.year < a.year)
                    return 1;
                return 0;
            });

        },
    },
});