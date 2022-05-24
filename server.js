const http = require('http');
const express = require('express')
const es6Renderer = require('express-es6-template-engine')
const { ceos } = require('./data');
const res = require('express/lib/response');
const bodyParser = require("body-parser")
const hostname = "localhost"
const port = 3000
const app = express()
app.engine("html", es6Renderer)
app.set("views", "templates")
app.set("view engine", "html")
const partials = {
    head: "partials/head",
    foot: "partials/foot",
}
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const server = http.createServer(app)

app.use(express.static(("./public")))


app.get('/', (req, res) => {
    res.render("home", {
        partials,
        locals: {
            title: "Home"
        }
    })
})

app.get('/ceos', (req, res) => {
    res.render("ceo-list", {
        partials,
        locals: {
            ceos,
            title: "Ceo's"
        }
    })
})


app.post("/search", urlencodedParser, (req, res) => {
    const ceo = ceos.find(c => c.name.toLowerCase().includes(req.body.name.toLowerCase()))
    if (!ceo) {
        res.status(404).send(`Could not find ceo with name: ${req.body.name}`)
        return
    }

    res.render("ceo-details", {
        partials,
        locals: {
            ceo,
            title: `${ceo.name}'s Profile`
        }
    })
})
// Both searches are working(except for cases with multiple name matches)

// app.get("/search", urlencodedParser, (req, res) => {
//     const ceo = ceos.find(c => c.name.toLowerCase().includes(req.query.name.toLowerCase())) && ceos.find(c => c.year.includes(req.query.year.))
//     if (!ceo) {
//         res.status(404).send(`Could not find ceo with name: ${req.query.name}`)
//         return
//     }

//     res.render("ceo-details", {
//         partials,
//         locals: {
//             ceo,
//             title: `${ceo.name}'s Profile`
//         }
//     })
// })

app.get("/ceos/:name", (req, res) => {
    const ceo = ceos.find(c => c.name === req.params.name)
    if (!ceo) {
        res.status(404).send(`Could not find ceo with name: ${req.params.name}`)
        return
    }
    res.render("ceo-details", {
        partials,
        locals: {
            ceo,
            title: `${ceo.name}'s Profile`
        }
    })
})

app.get("/ceos/:slug", (req, res) => {
    const ceo = ceos.find(c => c.slug === req.params.slug)
    console.log(ceos)
    if (!ceo) {
        res.status(404).send(`Could not find ceo with slug: ${req.params.slug}`)
        return
    }
    res.render("ceo-details", {
        partials,
        locals: {
            ceo,
            title: `${ceo.name}'s Profile`
        }
    })
})





server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})