import React, { Component } from 'react'
import { View, Text, ScrollView, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { Card } from 'react-native-elements'

import Constants from "expo-constants";
const { manifest } = Constants;
const uri = `http://${manifest.debuggerHost.split(':').shift()}:3000/hubs`;
// const uri = 'http://10.198.66.194:3000/hubs'
import HubCard from './HubCard'


export default class HubScroll extends Component {
    constructor(props) {
        super(props)

    }

    fullySortedHubs = () => {
        const hubs = this.sortHubsByLocation().map(thing => thing.hub)
        return hubs
    }
    sortHubsByRating = () => {
        return(this.sortHubsByLocation().sort((a, b) => (a.hub.rating > b.hub.rating) ? -1 : (a.hub.rating === b.hub.rating) ? ((a.hub.reviews.length > b.hub.reviews.length) ? -1 : 1) : 1 ))
    }

    sortHubsByLocation = () => {
        const currentLocation = this.props.location
        const distArray = this.props.hubs.map(hub => {
            return {hub: hub, dist: this.distanceFormula(currentLocation, hub)}
        })
        const sortedDist = distArray.sort((a, b) => (a.dist > b.dist) ? 1 : -1 )
        return sortedDist
    }

    distanceFormula = (a, b) => {
        let lat1 = Number(a.lat)	
        let lat2 = Number(b.latitude)
        let lon1 = Number(a.lng)
        let lon2 = Number(b.longitude)

        let x = (lon2-lon1) * Math.cos((lat1+lat2)/2);
        let y = (lat2-lat1);
        let d = Math.sqrt(x*x + y*y);
        return d
    }

//  Hub data
//     "address": null,
//   "description": "It’s a the best!",
//   "id": 35,
//   "latitude": "41.8905371715378",
//   "longitude": "-87.62745202028827",
//   "name": "Star of Siam",
//   "noise": "Loud",
//   "rating": 3,
//   "restrooms": true,
    render() {

        if (this.props.isLoading) {
            return (
                <View style={{ flex: 1, padding: 20 }}>
                    <ActivityIndicator />
                </View>
            )
        }


        return (
            <View style={{ flex: 1 }}>
                <View style={styles.hubTitleContainer}>
                    <Text style={styles.hubScrollTitle}>Hubs near you...</Text>
                </View>
                <ScrollView contentContainerStyle={{ paddingVertical: 5 }}>
                    {this.fullySortedHubs().map(({ name, rating, id ,description, reviews}) => (
                        <HubCard 
                            key={id} 
                            name={name} 
                            rating={rating}
                            id={id} 
                            reviews={reviews} 
                            description={description}
                            renderStars={this.props.renderStars} 
                            navigation={this.props.navigation}
                        />
                    ))
                    }
                </ScrollView>
            </View>

        );
    }
}


const styles = StyleSheet.create({
    hubScrollTitle: {
        paddingLeft: 20,
        paddingVertical: 10,
        fontSize: 20,
        
    },
    hubTitleContainer:{
        borderBottomColor: 'black',
        borderBottomWidth: 1,
    }
})