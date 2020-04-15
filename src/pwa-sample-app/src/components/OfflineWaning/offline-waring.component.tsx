import React from 'react';

type OfflineState = {
    isOffline: boolean
}

export default class OfflineWaring extends React.PureComponent<{}, OfflineState> {

    constructor(props: any) {
        super(props);

        this.state = {
            isOffline: !navigator.onLine
        }
    }

    componentDidMount(){
		// Add event listener offline to detect network loss.
		window.addEventListener("offline", () => this.onChangeNetworkState(true));

		// Add event listener online to detect network recovery.
		window.addEventListener("online", () => this.onChangeNetworkState(false));
    }
    
    componentWillUnmount() {
		// Remove event listener offline to detect network loss.
		window.removeEventListener("offline", () => this.onChangeNetworkState(true));

		// Remove event listener online to detect network recovery.
		window.removeEventListener("online", () => this.onChangeNetworkState(false));
    }
    
    onChangeNetworkState(isOffline: boolean) {
		this.setState({isOffline});
    }
    
    render() {
        if (!this.state.isOffline) {
            return null;
        }

        return (<div style={{backgroundColor: 'yellow', width: '100vw', position: 'fixed'}}>You are offline</div>);
    }
}