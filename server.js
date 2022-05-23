const http = require('http');
const express = require('express')
const es6Renderer = require('express-es6-template-engine')
const { ceos } = require('./data')

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

app.get('/ceos', (req, res) => {
    res.render("ceo-list", {
        partials,
        locals: {
            ceos,
            title: "Ceo's"
        }
    })
})

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

app.get('/ceos/', (req, res) => {
    const search = req.query.search
    console.log(search)
    if (!search) return res.json(data.ceos)
    else {
        const filteredCeos = data.ceos.filter((ceo) => ceo.name.toLowerCase().includes(search.toLowerCase()))
        return (res.json(filteredCeos))
    }


})



server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})