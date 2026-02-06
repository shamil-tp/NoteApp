const express = require('express')
const os = require('os')
const app = express()

const interfaces = os.networkInterfaces()

let hostname
// console.log(Object.keys(interfaces))
for (const name of Object.keys(interfaces)){
    for(const ip of Object.values(interfaces[name])){
        if(ip.family == "IPv4" && !ip.internal){
            hostname = ip.address
        }
    }
}
if(!hostname){
    hostname='127.0.0.1'
}


app.set('view engine','ejs')
app.use(express.static('static'))
app.use(express.urlencoded())

const currentDate = new Date();

let notes = [
    
]

app.get('/',(req,res) => {
    return res.render('home',{notes:notes})
})
app.post('/add',(req,res)=>{
    let newNote = req.body.text
    notes.push({
        id:`${Date.now()}`,
        text:newNote,
        date:currentDate.toDateString()
    })
    return res.redirect('/')
})

app.get('/view/:noteId',(req,res)=>{
    let viewNoteId = req.params.noteId
    let viewNote = notes.find((e)=>{
        return e.id == viewNoteId
    })
    // console.log(viewNote)
    return res.render('note',{viewNote:viewNote})
})

app.get('/delete/:noteId',(req,res)=>{
    let deleteId = req.params.noteId
    notes = notes.filter((element)=>{
        return element.id != deleteId
    })
    return res.redirect('/')

})

app.get('/update/:noteId',(req,res)=>{
    let updateNoteId = req.params.noteId
    let updateNote = notes.find((e)=>{
        return e.id == updateNoteId
    })
    // console.log(updateNote)
    return res.render('update',{notes:notes,updateNote:updateNote})
})

app.post('/update/:noteId',(req,res)=>{
    notes = notes.map((e) =>{
        if(e.id == req.params.noteId){
            e.text = req.body.text
            return e
        }
        return e
    })
    return res.redirect('/')
})

app.use((req,res)=>{
    return res.redirect('/')
})

app.listen(3000,hostname,()=>{
    console.log(`app is running at http://${hostname}:3000`)
    // 192.168.29.178
})
