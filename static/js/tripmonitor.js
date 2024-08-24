class TripMonitor {
    constructor(stopRef, numResults, orderType = 'estimated_time') {
        this.stopRef = stopRef;
        this.numResults = numResults;
        this.orderType = orderType;
    }

    updateDepartures(departureTemplate, udpateFrequency, callback) {
        // create template
        this.departureTemplate = _.template(departureTemplate);

        // initial call
        this.updateDeparturesAsync(callback);

        // periodic call
        let t = this;
        setInterval(function() {
            t.updateDeparturesAsync(callback)
        }, udpateFrequency * 1000);
    }

    async updateDeparturesAsync(callback) {
        let t = this;

        let response = await fetch(`/json/departures/${this.orderType}/${this.stopRef}/${this.numResults}.json`);
        let result = await response.json();

        let html = '';
        _.forEach(result.departures, function (departure) {
            html += t.departureTemplate({
                planned_time: departure.planned_time,
                estimated_time: departure.estimated_time,
                realtime: departure.realtime,
                cancelled: departure.cancelled,
                planned_bay: departure.planned_bay,
                mode: departure.mode,
                sub_mode: departure.sub_mode,
                published_mode: departure.published_mode,
                line_name: departure.line_name,
                line_description: departure.line_description,
                origin_text: departure.origin_text,
                destination_text: departure.destination_text
            });
        });

        callback(html, result.departures.length);
    }
}