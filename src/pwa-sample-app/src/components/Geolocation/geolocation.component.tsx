import React, { Component, Fragment } from 'react';
import { Message } from 'components/Message/message.component';

type GeolocationState = {
    position: Position,
    geolocationStatus: string,
    isGeolocationSupported: boolean,
    embedMapUrl: string,
};

export default class GeolocationComponent extends Component<{}, GeolocationState> {

    private idGeoWatch: number | undefined;

    constructor(props: {}) {
        super(props);
        this.state = {
            position: { coords: { latitude: 0, longitude: 0, accuracy: 0, altitude: 0, altitudeAccuracy: 0, heading: 0, speed: 0 }, timestamp: 0 },
            geolocationStatus: '',
            isGeolocationSupported: !!navigator.geolocation,
            embedMapUrl: ''
        };

        this.setPositionIntoState = this.setPositionIntoState.bind(this);
    }

    // After the component did mount, we set the state each second.
    componentDidMount() {
        navigator.permissions.query({ name: 'geolocation' })
            .then(function (permissionStatus) {
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
        const latitudeDiff = Math.abs(this.state.position.coords.latitude - position.coords.latitude);
        const longitudeDiff = Math.abs(this.state.position.coords.longitude - position.coords.longitude);

        // Only update embedded map when position has significant changed
        const embedMapUrl = (longitudeDiff >= 0.009 || latitudeDiff >= 0.009)
            ? `https://www.openstreetmap.org/export/embed.html?bbox=${position.coords.longitude + 0.002},${position.coords.latitude + 0.001},${position.coords.longitude - 0.002},${position.coords.latitude - 0.001}&layer=mapnik&marker=${position.coords.latitude}%2C${position.coords.longitude}&amp;map=16`
            : this.state.embedMapUrl;

        this.setState({
            ...this.state,
            position,
            embedMapUrl
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
                <p className="title">Date: <span>{() => { try {new Date(this.state.position.timestamp)} catch(e){console.warn(`Not date ${this.state.position.timestamp}`)}}}</span></p>
            </div>);
    }

    renderMap() {
        return (
            <Fragment>
                <iframe title="map" width="100%" height="30%" frameBorder="0" scrolling="no" marginHeight={0} marginWidth={0} src={this.state.embedMapUrl}></iframe>
            </Fragment>
        );
    }

    render() {
        if (!this.state.isGeolocationSupported) {
            return (<Message message='Your browser do not support geolocation api.' />)
        }

        if (this.state.geolocationStatus !== 'granted') {
            switch (this.state.geolocationStatus) {
                case 'denied':
                    return (<Message message='You have denied access to your geolocation api.' />);
                case 'prompt':
                    return (<Message message='Please allow us to access your geolocation api.' />);
                default:
                    return (<Message message='Loading...' />);
            }
        }

        return (<div>
            <div>
                {this.renderMap()}
                <br /><small><a id="mapLink" href={`https://www.openstreetmap.org/?mlat=${this.state.position.coords.latitude}&amp;mlon=${this.state.position.coords.longitude}#map=16/${this.state.position.coords.latitude}/${this.state.position.coords.longitude}`}>View Larger Map</a></small>
            </div>
            <div>
                {this.renderPosition()}
            </div>
        </div>);
    }
}