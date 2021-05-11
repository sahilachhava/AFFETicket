import React, { Component } from "react";
import {
    AppRegistry,
    StyleSheet,
    View,
    StatusBar,
    Text,
    ActivityIndicator,
    Dimensions,
    AsyncStorage,
} from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import TouchableScale from 'react-native-touchable-scale'; 
import LinearGradient from 'react-native-linear-gradient'; 
import { SearchBar, ListItem, ButtonGroup } from 'react-native-elements';
import { firestore, auth } from './../config.js';
import NetInfo from "@react-native-community/netinfo";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default class ValAllTickets extends Component{

    constructor(){
        super()
        this.state = {
            day1Tickets: [],
            day2Tickets: [],
            day3Tickets: [],
            search: '',
            load: true,
            selectedIndex: 0,
            users : [],
            showLoader: false,
            currentDoc: ' ',
            validatorData: {},
        }
        this.updateIndex = this.updateIndex.bind(this)
    }

    static navigationOptions = ({ navigation }) => {
    return{
        title: 'Validated Tickets',
        headerStyle: {
            backgroundColor: '#2c3e50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: SCREEN_WIDTH * 0.05,
            fontFamily: 'Arial',
        },
        headerRight : null,
        }
    }

    componentDidMount(){
        const redeemTicket = this.props.navigation.state.params ? this.props.navigation.state.params.validator : null;
        if(redeemTicket != null){
            this.setState({validatorData: this.props.navigation.state.params.validator})
        }

        firestore.collection("config").doc("eTickets").onSnapshot(function(doc){
            const data = doc.data();
            if(data.currentDay=='day1'){
                this.setState({selectedIndex: 0, users: this.state.day1Tickets});
            }else if(data.currentDay=='day2'){
                this.setState({selectedIndex: 1, users: this.state.day2Tickets});
            }else if(data.currentDay=='day3'){
                this.setState({selectedIndex: 2, users: this.state.day3Tickets});
            }
        }.bind(this));

        const rootday1Tickets = firestore.collection("eticket").doc("ticketCodes").collection("day1");
        rootday1Tickets.onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if(doc.data().isValidated == true){
                    this.state.day1Tickets.push(doc);
                }
            });
        });

        const rootday2Tickets = firestore.collection("eticket").doc("ticketCodes").collection("day2");
        rootday2Tickets.onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if(doc.data().isValidated == true){
                    this.state.day2Tickets.push(doc);
                }
            });
        });

        const rootday3Tickets = firestore.collection("eticket").doc("ticketCodes").collection("day3");
        rootday3Tickets.onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if(doc.data().isValidated == true){
                    this.state.day3Tickets.push(doc);
                }
            });
            this.setState({load:false});
        });
    }

    componentDidUpdate(){
        NetInfo.isConnected.fetch().then(isConnected => {
        if(!isConnected){
            setTimeout(()=>{
            this.props.navigation.navigate("ValNoInternet", {validator: this.state.validatorData});
            },
            1000);
        }
        });
    }

    updateIndex (selectedIndex) {
        this.setState({selectedIndex});
        if(selectedIndex==0){
            this.setState({users: this.state.day1Tickets});
        }else if(selectedIndex==1){
            this.setState({users: this.state.day2Tickets});
        }else if(selectedIndex==2){
            this.setState({users: this.state.day3Tickets});
        }
    }

    searchClear=()=>{
        const {selectedIndex} = this.state;
        if(selectedIndex==0){
            this.setState({users: this.state.day1Tickets, showLoader: false});
        }else if(selectedIndex==1){
            this.setState({users: this.state.day2Tickets, showLoader: false});
        }else if(selectedIndex==2){
            this.setState({users: this.state.day3Tickets, showLoader: false});
        }
    }

    updateSearch = search => {
        const {users,selectedIndex} = this.state;
        this.setState({ search });

        if(selectedIndex==0){
            const newData = users.filter((item)=>{
                const itemData = item.data().userNumber
                const textData = search
                return itemData.indexOf(textData)>-1
            });
            this.setState({users: newData, showLoader: true});
        }else if(selectedIndex==1){
            const newData = users.filter((item)=>{
                const itemData = item.data().userNumber
                const textData = search
                return itemData.indexOf(textData)>-1
            });
            this.setState({users: newData, showLoader: true});
        }else if(selectedIndex==2){
            const newData = users.filter((item)=>{
                const itemData = item.data().userNumber
                const textData = search
                return itemData.indexOf(textData)>-1
            });
            this.setState({users: newData, showLoader: true});
        }

        if(this.state.search.length < 2){
            const {selectedIndex} = this.state;
            if(selectedIndex==0){
                this.setState({users: this.state.day1Tickets, showLoader: false});
            }else if(selectedIndex==1){
                this.setState({users: this.state.day2Tickets, showLoader: false});
            }else if(selectedIndex==2){
                this.setState({users: this.state.day3Tickets, showLoader: false});
            }
        }
    };

    showDetails=(doc)=>{
        this.props.navigation.navigate("ValidationDetails", {validator: this.state.validatorData, redeemTicket: doc});
    }

    render(){
        const buttons = ['Day 1', 'Day 2', 'Day 3']
        const { selectedIndex } = this.state
        if(this.state.load == true) {
            return(
                <View style={styles.container}>
                    <ActivityIndicator style={styles.loader} size='small' />
                    <Text style={styles.loaderText}>Getting Tickets for you..</Text>
                </View>
            )
        }

        return(
            <View style={styles.container}>
                <ScrollView>
                    <StatusBar hidden={false} barStyle='light-content' backgroundColor={Platform.OS === "ios" ? null : '#34495e'}/>
                    <SearchBar
                        containerStyle={styles.searchBar}
                        placeholder="Search Tickets by Phone No"
                        onChangeText={this.updateSearch}
                        value={this.state.search}
                        platform='ios'
                        round={true}
                        onClear={this.updateIndex}
                        keyboardType='numeric'
                        maxLength={10}
                        showLoading={this.state.showLoader}
                        onClear={this.searchClear}
                        cancelButtonProps={{
                            color: '#00a8ff',
                            onCancel: null,
                        }}
                    />
                    <View style={{marginTop: SCREEN_HEIGHT * 0.015, alignItems: 'center'}}>
                        <ButtonGroup
                            onPress={this.updateIndex}
                            selectedIndex={selectedIndex}
                            buttons={buttons}
                            containerStyle={{height: SCREEN_HEIGHT * 0.045}}
                        />
                        <View style={{marginTop: SCREEN_HEIGHT * 0.02}}>
                            {
                                this.state.users.map((doc) => {
                                    const data = doc.data();
                                    return (
                                        <View>
                                        <ListItem
                                            Component={TouchableScale}
                                            friction={90} 
                                            tension={100} 
                                            activeScale={0.95} 
                                            linearGradientProps={{
                                                colors: ['#636e72', '#6c5ce7'],
                                                startPoint: [0.5, 1],
                                                endPoint: [0.5, 0.5],
                                            }}
                                            ViewComponent={LinearGradient} 
                                            leftAvatar={{ rounded: true, source: require('./../../assets/images/affLogo.png') }}
                                            titleStyle={{ color: 'white', fontWeight: 'bold' }}
                                            subtitleStyle={{ color: 'white' }}
                                            chevronColor="white"
                                            chevron
                                            roundAvatar
                                            style={styles.item}
                                            key={doc.id}
                                            title={doc.id}
                                            subtitle={data.userNumber}
                                            onPress={()=>this.showDetails(data)}
                                        />
                                        </View>
                                    );
                                })
                            }
                            </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#34495e',
      position: 'relative',
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    },
    loader: {
        marginTop: SCREEN_HEIGHT * 0.35,
        alignSelf: 'center',
    },
    loaderText: {
        marginTop: SCREEN_HEIGHT * 0.03,
        alignSelf: 'center',
        color: 'white'
    }, 
    searchBar: {
        marginTop: SCREEN_HEIGHT * 0.017,
        height: SCREEN_HEIGHT * 0.06,
        width: SCREEN_WIDTH * 0.98,
        alignSelf: 'center',
        borderRadius: SCREEN_WIDTH * 0.2,
        backgroundColor: '#34495e',
    },
    item: {
        width: SCREEN_WIDTH * 0.93,
        fontSize: SCREEN_WIDTH * 0.02,
        borderBottomColor: 'black',
        borderBottomWidth: SCREEN_WIDTH * 0.01,
    },
  });
  
  AppRegistry.registerComponent('ValAllTickets', ()=> ValAllTickets);