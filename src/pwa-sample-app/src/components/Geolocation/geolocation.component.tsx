import React, { Component, Fragment } from 'react';

type GeolocationState = {
    position: Position,
    geolocationStatus: string,
    isGeolocationSupported: boolean
};

export default class GeolocationComponent extends Component<{}, GeolocationState> {

    private idGeoWatch: number | undefined;

    constructor(props: {}) {
        super(props);
        this.state = {
            position: { coords: { latitude: 0, longitude: 0, accuracy: 0, altitude: 0, altitudeAccuracy: 0, heading: 0, speed: 0 }, timestamp: 0 },
            geolocationStatus: '',
            isGeolocationSupported: !!navigator.geolocation
        };
        
        this.setPositionIntoState = this.setPositionIntoState.bind(this);
    }

    // After the component did mount, we set the state each second.
    componentDidMount() {
        navigator.permissions.query({name:'geolocation'})
            .then(function(permissionStatus) {
                console.log('geolocation permission state is ', permissionStatus.state);
                return permissionStatus;
            })
            .then(permissionStatus => {
                this.setState({
                    ...this.state,
                    geolocationStatus: permissionStatus.state
                });
                permissionStatus.onchange = () => this.onChangeGeolocationStatus(permissionStatus);
            });
        this.watchPosition();
    }

    componentWillUnmount() {
        this.clearWatch();
    }

    onChangeGeolocationStatus(permissionStatus: PermissionStatus) {
        this.setState({
            ...this.state,
            geolocationStatus: permissionStatus.state
        });
    }

    watchPosition() {
        if (navigator.geolocation) {
            this.idGeoWatch = navigator.geolocation.watchPosition(this.setPositionIntoState);
        }
    }

    clearWatch() {
        if (navigator.geolocation && this.idGeoWatch !== undefined) {
            navigator.geolocation.clearWatch(this.idGeoWatch);
        }
    }

    setPositionIntoState(position: Position) {
        this.setState({
            ...this.state,
            position: position,
        });
    }

    renderMessage(message: string) {
        return (<h1>{message}</h1>);
    }

    renderPosition() {
        return (
            <div className="mapInfo">
                <h2 className="mainTitle">Informations</h2>
                <p className="title">Accuracy: <span>{this.state.position.coords.accuracy}</span></p>
                <p className="title">Altitude: <span>{this.state.position.coords.altitude}</span></p>
                <p className="title">Alt accuracy: <span>{this.state.position.coords.altitudeAccuracy}</span></p>
                <p className="title">Heading: <span>{this.state.position.coords.heading}</span></p>
                <p className="title">Latitude: <span>{this.state.position.coords.latitude}</span></p>
                <p className="title">Longitude: <span>{this.state.position.coords.longitude}</span></p>
                <p className="title">Speed: <span>{this.state.position.coords.speed}</span></p>
                <p className="title">timestamp: <span>{this.state.position.timestamp}</span></p>
            </div>);
    }

    renderMap() {
        const urlFrame = `https://www.openstreetmap.org/export/embed.html?bbox=${this.state.position.coords.longitude}%2C${this.state.position.coords.latitude}%2C${this.state.position.coords.longitude}%2C${this.state.position.coords.latitude}&amp;layer=mapnik&amp;marker=${this.state.position.coords.latitude}%2C${this.state.position.coords.longitude}`;
        const urlLink = `https://www.openstreetmap.org/?mlat=${this.state.position.coords.latitude}&amp;mlon=${this.state.position.coords.longitude}#map=18/${this.state.position.coords.latitude}/${this.state.position.coords.longitude}`;

        return(
            <Fragment>
                <iframe title="map" width="100%" height="30%" frameBorder="0" scrolling="no" marginHeight={0} marginWidth={0} src={urlFrame}></iframe><br/><small><a id="mapLink" href={urlLink}>Ver Mapa Ampliado</a></small>
            </Fragment>
        );
    }

    render() {
        if (!this.state.isGeolocationSupported) {
            return this.renderMessage('Your browser do not support geolocation api.')
        }

        switch (this.state.geolocationStatus) {
            case 'granted':
                return (<div><div>{this.renderMap()}</div><div>{this.renderPosition()}</div></div>);
            case 'denied':
                return this.renderMessage('You have denied access to your geolocation api.');
            case 'prompted':
                return this.renderMessage('Please allow us to access your browser geolocation api.');
            default:
                return this.renderMessage('An error occur with geolocation api.');
        }
    }
}