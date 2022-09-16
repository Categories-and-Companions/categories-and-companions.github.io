function strcmp(a, b) {
    if (a < b) {
        return -1;
    } else if (a > b) {
        return 1;
    } else {
        return 0;
    }
}

// function cmpMaybe(maybeA, maybeB, cmp) {
//     if (maybeA.case === "Nothing" &&
//         maybeB.case === "Nothing") {
//         return 0;
//     } else if (
//         maybeA.case === "Just" &&
//         maybeB.case === "Nothing") {
//         return -1;
//     } else if (
//         maybeA.case === "Nothing" &&
//         maybeB.case === "Just") {
//         return 1;
//     } else if (
//         maybeA.case === "Just" &&
//         maybeB.case === "Just") {
//         return cmp(maybeA.value, maybeB.value);
//     } else {
//         throw `Called cmpMaybe on invalid value ${maybeA} or ${maybeB}`;
//     }
// }


// Grouping into day numbers is hacky.
// In future, want to group into and
// sort by date.
async function fetchAllAbstracts() {
    const response = await fetch('abstracts.json');
    const sessions = await response.json();

    console.log("Sessions", sessions);

    // Used to work out local timezone
    // Under the assumption that the
    // timezone doesn't change through
    // the week, can use the time of
    // any session.
    var sampleDate = new Date();

    // session_groups maps each day
    // number (0-7) to an array of
    // sessions on that day. Day 7
    // means no date provided.
    const sessionGroups = new Map();
    for (const session of sessions) {
        var dayNumber = 7;

        date = new Date(session.start_ISO8601);
        if (isFinite(date)) {
            sampleDate = date;
            dayNumber = date.getDay();

            if (!sessionGroups.has(dayNumber)) {
                sessionGroups.set(dayNumber, new Array());
            }
    
            const groupSessions = sessionGroups.get(dayNumber);
            groupSessions.push(session);
        } 
    }

    const abstractCardContainer = document.getElementById('abstract-cards');

    const explanation = document.createElement('p');

    

    const offset = -1 * sampleDate.getTimezoneOffset();
    const offsetSign = Math.sign(offset);
    const offsetTotalMinutes = offsetSign * offset;
    const offsetMinutes = offsetTotalMinutes % 60;
    const offsetHours = (offsetTotalMinutes - offsetMinutes) / 60;

    console.log("Sample date", sampleDate, "Offset", offset);

    const offsetString
        = ((offsetSign > 0) ? '+' : '-')
        + offsetHours
        + ((offsetMinutes > 0) ?
            ':' + offsetMinutes :
            '');

    explanation.textContent = `All dates and times given in the timezone UTC${offsetString}.`
    abstractCardContainer.appendChild(explanation);

    const dayNumbers = Array.from(sessionGroups.keys()).sort();
    for (const dayNumber of [0, 1, 2, 3, 4, 5, 6, 7]) {
        if (!sessionGroups.has(dayNumber)) {
            continue;
        }

        const sessions = sessionGroups
            .get(dayNumber)
            .sort((a, b) => {
                return strcmp(a.start_ISO8601, b.start_ISO8601);
            });

        const groupNames = ['Sunday, September 18', 'Monday, September 19', 'Tuesday, September 20', 'Wednesday, September 21', 'Thursday, September 22', 'Friday, September 23', 'Saturday, September 24', 'Unscheduled'];

        const heading = document.createElement('h3');
        heading.textContent = groupNames[dayNumber];

        const accordion = document.createElement('div');
        accordion.setAttribute('class', 'accordion');
        // TODO: sort the sessions
        for (session of sessions) {
            accordion.appendChild(createAbstractCard(session));
        }

        const paragraph = document.createElement('p');
        paragraph.appendChild(accordion);

        abstractCardContainer.appendChild(heading);
        abstractCardContainer.appendChild(paragraph);
    }
}


// function caseMaybe(maybeVal, onNothing, onJust) {
//     if (maybeVal.case === "Nothing") {
//         return onNothing();
//     } else if (maybeVal.case === "Just") {
//         return onJust(maybeVal.value);
//     } else {
//         throw `Called caseMaybe on invalid value ${maybeVal}`;
//     }
// }


function formatDate(time) {
    // See https://tc39.es/ecma402/#datetimeformat-objects
    const dateTimeFormat = new Intl.DateTimeFormat(
        'en-au', //default
        {
            weekday: 'long'
        }
    );

    return dateTimeFormat
        .format(new Date(time));
}

function formatTime(time) {
    // See https://tc39.es/ecma402/#datetimeformat-objects
    const dateTimeFormat = new Intl.DateTimeFormat(
        'default',
        {
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
        }
    );

    return dateTimeFormat
        .format(new Date(time));
}


function createAbstractCard(abstract) {
    // Node id to link collapse button with collapse
    const id = "item-" + generateId();

    const item = document.createElement('div');
    item.setAttribute('class', 'accordion-item');

    // CARD HEADER
    const header = document.createElement('div');
    header.setAttribute('class', 'accordion-header');
    item.appendChild(header);

    const button = document.createElement('div');
    const activity_type_class =
        (abstract.invited)
            ? 'invited-speaker'
            : 'speaker';
        
    button.setAttribute('class', `accordion-button collapsed ${activity_type_class}`);
    button.setAttribute('data-bs-toggle', 'collapse');
    button.setAttribute('data-bs-target', `#${id}`);
    header.appendChild(button);

    const container = document.createElement('div');
    container.setAttribute('class', 'container-fluid');
    button.appendChild(container);

    const outer_row = document.createElement('div');
    outer_row.setAttribute('class', 'row align-items-center');
    container.appendChild(outer_row);

    const time_col = document.createElement('div');
    time_col.setAttribute('class', 'col-2 col-lg-1 h6 text-center');
    time_col.textContent = formatTime(abstract.start_ISO8601);
    outer_row.appendChild(time_col);

    const info_col = document.createElement('div');
    info_col.setAttribute('class', 'col-10 col-lg-11');
    outer_row.appendChild(info_col);

    const title_row = document.createElement('div');
    title_row.setAttribute('class', 'row');
    info_col.appendChild(title_row);

    const title_col = document.createElement('div');
    title_col.setAttribute('class', 'col h5');
    title_col.textContent = (abstract.title !== undefined) ? abstract.title : "Title TBA";
    title_row.appendChild(title_col);

    const speaker_row = document.createElement('div');
    speaker_row.setAttribute('class', 'row');
    info_col.appendChild(speaker_row);

    const speaker_col = document.createElement('div');
    speaker_col.setAttribute('class', 'col h5 text-muted small');
    speaker_col.textContent = `${abstract.name} \u2022 ${abstract.affiliation}`;
    speaker_row.appendChild(speaker_col);

    if (abstract.invited) {
        const invited_row = document.createElement('div');
        invited_row.setAttribute('class', 'row');
        info_col.appendChild(invited_row);

        const invited_col = document.createElement('div');
        invited_col.setAttribute('class', 'col h5 text-muted small');
        invited_col.textContent = 'Invited speaker';
        invited_row.appendChild(invited_col);
    }
    

    // CARD BODY
    const collapse = document.createElement('div');
    collapse.setAttribute('class', 'accordion-collapse collapse');
    collapse.setAttribute('id', id);
    item.appendChild(collapse);

    const body = document.createElement('div');
    body.setAttribute('class', 'accordion-body');
    body.innerHTML = (abstract.abstract !== undefined) ? abstract.abstract : "Abstract TBA";
    collapse.appendChild(body);

    return item;
}

async function fetchAllOrganisers() {
    const response = await fetch('organisers.json');
    const organisers = await response.json();
    organisers.sort((a, b) =>
        strcmp(a.last_name, b.last_name));

    const organiserTable = document.getElementById('organiser-table-body');

    for (organiser of organisers) {
        organiserTable.appendChild(createOrganiserRow(organiser));
    }
}

/*
<tr>
    <th scope="row">Giulian Wiggins</th>
    <td>University of Sydney</td>
    <td><a href="mailto:G.Wiggins@maths.usyd.edu.au">G.Wiggins@maths.usyd.edu.au</a></td>
</tr>
*/
function createOrganiserRow(organiser) {
    const nameColumn = document.createElement('th');
    nameColumn.setAttribute('scope', 'row');
    nameColumn.textContent = `${organiser.first_name} ${organiser.last_name}`;

    const affiliationColumn = document.createElement('td');
    affiliationColumn.textContent = organiser.affiliation;

    const row = document.createElement('tr');
    row.appendChild(nameColumn);
    row.appendChild(affiliationColumn);

    return row;
}

function dec2hex(dec) {
    return dec.toString(16).padStart(2, "0")
}

// generateId :: Integer -> String
function generateId(len) {
    var arr = new Uint8Array((len || 40) / 2)
    window.crypto.getRandomValues(arr)
    return Array.from(arr, dec2hex).join('')
}

async function main() {
    await fetchAllAbstracts();
    await fetchAllOrganisers();
    await MathJax.typesetPromise();
}

main();

