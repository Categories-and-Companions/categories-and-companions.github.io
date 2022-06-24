To run locally, run `python -m SimpleHTTPServer` or `python3 -m http.server` in the root directory of this project and then go to `localhost:8000/`

To test timezones in Chrome on MacOS, first `mkdir ~/chrome-profile` and then use `TZ='Europe/London' open -na "Google Chrome" --args "--user-data-dir=$HOME/chrome-profile"`.

`Pacific/Fakaofo`
`America/Atka`

# abstracts.json format
```
    {
        "presenter" : {
            "name" : "Presenter TBA",
            "affiliation" : "University TBA",
            "invited" : true
        },
        "talk" : {
            "title" : "Title TBA",
            "abstract" : "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et congue mauris. In egestas sapien id aliquam molestie. In iaculis mauris vel massa viverra laoreet. Aliquam laoreet hendrerit finibus. Donec non erat at ipsum sodales cursus ullamcorper sit amet orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut pellentesque suscipit ipsum, in malesuada ligula volutpat in. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>",
            "start_ISO8601" : "2021-06-07T22:00Z",
            "end_ISO8601" : "2021-06-08T00:30Z"
        }
    }
```

Attendees have been instructed to format their abstract using only the following HTML tags:
* <p>for paragraphs</p>
* <a href='https://www.url.com'>for URLS</a>
and may include latex inline math formulae enclosed in \( and \).
* <b>for bold text</b>
* <i>for italicised text</i>

It may also include mathjax in \(\)

The special JSON characters " and \ must be escaped after the fact