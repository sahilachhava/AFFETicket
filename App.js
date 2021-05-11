import React, { Component } from "react";
import {createStackNavigator,createAppContainer} from 'react-navigation';
import Splash from './screens/Splash';
import Login from './screens/Login';
import NoInternet from './screens/NoInternet';
import ChangePassword from './screens/ChangePassword';
import GenDashboard from './screens/Generator/Dashboard';
import AllTickets from './screens/Generator/AllTickets';
import GenProfile from './screens/Generator/Profile';
import GenNoInternet from './screens/Generator/GenNoInternet';
import ValDashboard from './screens/Validator/Dashboard';
import ValAllTickets from './screens/Validator/AllTickets';
import ValProfile from './screens/Validator/Profile';
import ValidationDetails from './screens/Validator/ValidationDetails';
import GValidationDetails from './screens/Generator/ValidationDetails';
import ValNoInternet from './screens/Validator/ValNoInternet';
import RedeemCode from './screens/Validator/Redeem';
console.disableYellowBox=true;

class App extends Component{
    static navigationOptions = {
        header: null,
    }
    render(){
        return(
            <AppNavigator />
        )
    }
}

const AppNavigator = createStackNavigator({
    Splash: {
        screen:Splash,
        navigationOptions:{
            header: null,
            gesturesEnabled: false,
        }
    },
    Login: {
        screen:Login,
        navigationOptions:{
            header: null,
            gesturesEnabled: false,
        }
    },
    NoInternet: {
        screen:NoInternet,
        navigationOptions:{
            header: null,
            gesturesEnabled: false,
        }
    },
    ChangePassword: {
        screen: ChangePassword,
    },
    GenDashboard: {
        screen:GenDashboard,
    },
    GenProfile: {
        screen:GenProfile,
    },
    AllTickets: {
        screen:AllTickets,
    },
    GenNoInternet: {
        screen:GenNoInternet,
        navigationOptions:{
            header: null,
            gesturesEnabled: false,
        }
    },
    GValidationDetails: {
        screen: GValidationDetails,
    },
    ValDashboard: {
        screen:ValDashboard,
    },
    ValProfile: {
        screen:ValProfile,
    },
    RedeemCode: {
        screen: RedeemCode,
    },
    ValidationDetails: {
        screen: ValidationDetails,
    },
    ValAllTickets: {
        screen:ValAllTickets,
    },
    ValNoInternet: {
        screen:ValNoInternet,
        navigationOptions:{
            header: null,
            gesturesEnabled: false,
        }
    },
    },
    {
        initialRouteName: 'Splash',
});

export default createAppContainer(AppNavigator);

/*
rm -rf node_modules (if any error occur while building the app)

Emulators:
react-native run-ios --simulator="iPhone 11 Pro"
react-native run-ios --simulator="iPhone SE"
react-native run-ios --simulator="iPad Pro"

Functional Features:
Congratulations 

Non-Functional Features:
Make UI as good as possible
Reduce the Code as Much as Possible (Last Step)


App Build for Android Commands:

sudo keytool -genkey -v -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
cd android 
./gradlew clean
./gradlew assembleRelease
*/