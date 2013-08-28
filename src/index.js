var ui = require('./ui'),
    map = require('./ui/map'),
    data = require('./core/data'),
    router = require('./core/router'),
    loader = require('./core/loader'),
    store = require('store');

function geojsonIO() {
    var context = {};

    context.dispatch = d3.dispatch(
        'change', 'route'
    );

    context.storage = store;

    context.map = map(context);

    context.data = data(context);

    context.router = router(context);

    context.dispatch.on('route', loader(context));

    return context;
}

var gjIO = geojsonIO();
var gjUI = ui(gjIO);

d3.select('.geojsonio').call(gjUI);

gjIO.router.on();


/*

L.Polygon.prototype.getCenter = function() {
    var pts = this._latlngs;
    var off = pts[0];
    var twicearea = 0;
    var x = 0;
    var y = 0;
    var nPts = pts.length;
    var p1, p2;
    var f;
    for (var i = 0, j = nPts - 1; i < nPts; j = i++) {
        p1 = pts[i];
        p2 = pts[j];
        f = (p1.lat - off.lat) * (p2.lng - off.lng) - (p2.lat - off.lat) * (p1.lng - off.lng);
        twicearea += f;
        x += (p1.lat + p2.lat - 2 * off.lat) * f;
        y += (p1.lng + p2.lng - 2 * off.lng) * f;
    }
    f = twicearea * 3;
    return new L.LatLng(
        x / f + off.lat,
        y / f + off.lng
    );
};

d3.select(window).on('hashchange', hashChange);

d3.select('.collapse-button').on('click', clickCollapse);

if (window.location.hash) hashChange();

function clickSource() {
    if (d3.event) d3.event.preventDefault();
    d3.select('.left-panel').call(sourcePanel(updates));
}

function focusLayer(layer) {
    if (!layer) return;
    // geometrycollections
    if ('eachLayer' in layer) {
        var first = null;
        layer.eachLayer(function(l) {
            if (!first && 'openPopup' in l) first = l;
        });
        if (first) {
            first.openPopup();
            map.fitBounds(first.getBounds());
        }
    } else if ('getBounds' in layer && layer.getBounds().isValid()) {
        if ('getCenter' in layer) {
          layer.openPopup(layer.getCenter());
        } else {
          layer.openPopup();
        }
        map.fitBounds(layer.getBounds());
    } else if ('getLatLng' in layer) {
        layer.openPopup();
        map.setView(layer.getLatLng(), 15);
    }
}

function drawCreated(e) {
    drawnItems.addLayer(e.layer);
    mapUtil.geoify(drawnItems);
    refresh();
}



d3.select(document).call(
    d3.keybinding('global')
        .on('⌘+s', saveChanges)
        .on('⌘+o', clickSource));

function saveChanges() {
    if (d3.event) d3.event.preventDefault();

    var features = featuresFromMap();

    if (!features.length) {
        return flash(container, 'Add a feature to the map to save it');
    }

    var content = JSON.stringify({
        type: 'FeatureCollection',
        features: features
    }, null, exportIndentationStyle);

    if (!source() || source().type == 'gist') {
        gist.saveAsGist(content, function(err, resp) {
            if (err) return flash(container, err.toString());
            var id = resp.id;
            window.location.hash = gist.urlHash(resp).url;
            flash(container,
                'Changes to this map saved to Gist: <a href="' + resp.html_url +
                '">' + resp.html_url + '</a>');
        });
    } else if (!source() || source().type == 'github') {
        var wrap = commit(container, content, function(err, resp) {
            wrap.remove();
            if (err) return flash(container, err.toString());
            else flash(container, 'Changes committed to GitHub: <a href="' +
                       resp.commit.html_url + '">' + resp.commit.sha.substring(0, 10) + '</a>');

        });
    }
}


function mapFile(gist) {
    var f;
    for (f in gist.files) if (f.indexOf('.geojson') !== -1) return JSON.parse(gist.files[f].content);
    for (f in gist.files) if (f.indexOf('.json') !== -1) return JSON.parse(gist.files[f].content);
}

function hashChange() {

    // quiet a hashchange for one step
    if (silentHash) {
        silentHash = false;
        return;
    }

    var s = source();

    if (!s) {
        window.location.hash = '';
        return;
    }

    if (s.type == 'gist') gist.loadGist(s.id, onGistLoad);
    if (s.type == 'github') github.loadGitHubRaw(s.id, onGitHubLoad);

    function onGistLoad(err, json) {
        if (err) return flash(container, 'Gist API limit exceeded, come back in a bit.');
        var first = !drawnItems.getBounds().isValid();

        try {
            var file = mapFile(json);
            updates.update_editor(mapFile(json));
            if (drawnItems.getBounds().isValid()) map.fitBounds(drawnItems.getBounds());
            if (gist.urlHash(json).redirect) {
                silentHash = true;
                window.location.hash = gist.urlHash(json).url;
            }
            updates.update_map(mapFile(json), drawnItems);
            updates.sourcechange({
                type: 'gist',
                name: '#' + json.id,
                data: json
            });
        } catch(e) {
            console.log(e);
            flash(container, 'Invalid GeoJSON data in this Gist');
        }
    }

    function onGitHubLoad(err, file) {
        if (err) return flash(container, 'GitHub API limit exceeded, come back in a bit.');

        try {
            var json = JSON.parse(file);
            exportIndentationStyle = detectIndentationStyle(file);
            var first = !drawnItems.getBounds().isValid();
            updates.update_editor(json);
            if (first && drawnItems.getBounds().isValid()) {
                map.fitBounds(drawnItems.getBounds());
                buttons.filter(function(d, i) { return i == 1; }).trigger('click');
            }
            updates.update_map(json, drawnItems);
            updates.sourcechange({
                type: 'github',
                name: source().id,
                data: source()
            });
        } catch(e) {
            flash(container, 'Loading a file from GitHub failed');
        }
    }
}
*/
