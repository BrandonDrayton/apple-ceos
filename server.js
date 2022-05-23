const http = require('http');
const express = require('express')
const es6Renderer = require('express-es6-template-engine')
const { ceos } = require('./data');
const res = require('express/lib/response');

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

// app.get('/ceos', function (req, res) {
//     res.send('year: ' + req.query.year);
// })

app.get('/ceos', (req, res) => {
    res.render("ceo-list", {
        partials,
        locals: {
            ceos,
            title: "Ceo's"
        }
    })
})
// app.get('/ceos', (req, res) => {
//     const search = req.query
//     console.log(search)
//     const year = req.query.year
//     let filteredCeos = ceos
//     if (search) {
//         filteredCeos = filteredCeos.filter((ceo) => ceo.name.toLowerCase().includes(search.toLowerCase()))
//     }
//     if (year) {
//         filteredCeos = filteredCeos.filter((ceo) => ceo.year.toLowerCase().includes(year.toLowerCase()))
//     }
//     return (res.json(filteredCeos))
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
    if (!ceo) {
        res.status(404).send(`Could not find ceo with slug: ${req.params.slug}`)
        return
    }
    res.render("ceo-slug", {
        partials,
        locals: {
            ceo,
            title: `${ceo.slug}'s Profile`
        }
    })
})





server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})