import React, { Component } from "react";
import {
    AppRegistry,
    StyleSheet,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    Dimensions,
    TextInput,
    DismissKeyboard,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
    AsyncStorage,
} from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/Ionicons';
import { firestore, auth } from './config.js';

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

// const DismissKeyboard = ({ children }) => (
//   <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
//     {children}
//   </TouchableWithoutFeedback>
// );

export default class ChangePassword extends Component{

    constructor(){
        super()
        this.state = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        }
    }

    static navigationOptions = ({ navigation }) => {
        return{
            title: 'Change Password',
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

    async componentDidMount(){
        this.oldPInput.focus();
    }

    async backendValidate(){
        let type =  await AsyncStorage.getItem("type");
        if(JSON.parse(type)=='generator'){
            let name = await AsyncStorage.getItem("username");
            let pass = await AsyncStorage.getItem("password");
            if(JSON.parse(pass)==this.state.oldPassword){
                await AsyncStorage.setItem("password", JSON.stringify(this.state.confirmPassword));
                Alert.alert("Success", "Password Changed Successfully");
                this.props.navigation.navigate("GenDashboard");
            }else{
                Alert.alert("Warning !", "Invalid Old Password");
            }
        }else if(JSON.parse(type)=='validator'){
            let valData = await AsyncStorage.getItem("validator");
            let name = JSON.parse(valData);
            let pass = await AsyncStorage.getItem("password");
            if(JSON.parse(pass)==this.state.oldPassword){
                await AsyncStorage.setItem("password", JSON.stringify(this.state.confirmPassword));
                Alert.alert("Success", "Password Changed Successfully");
                this.props.navigation.navigate("ValDashboard");
            }else{
                Alert.alert("Warning !", "Invalid Old Password");
            }
        }
    }

    validateFields=()=>{
        if(this.state.oldPassword==""){
          Alert.alert("Warning !","Enter Valid Old Password");
          this.oldPInput.focus();
          return false;
        }else if(this.state.newPassword==""){
          Alert.alert("Warning !","Enter New Password");
          this.newPInput.focus();
          return false;
        }else if(this.state.confirmPassword==""){
            Alert.alert("Warning !","Enter New Password Again");
            this.conPInput.focus();
            return false;
        }else{
            if(this.state.newPassword != this.state.confirmPassword){
                Alert.alert("Warning !","Password Doesn't Match");
                this.conPInput.focus();
                return false;
            }else{
                return this.backendValidate();
            }
        }
    }

    render(){
        return(
        <View style={styles.container}>
            <ScrollView>
                <StatusBar hidden={false} barStyle='light-content' backgroundColor={Platform.OS === "ios" ? null : '#34495e'}/>
                <TouchableOpacity style={styles.mainBox} activeOpacity={1}>
                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.username}
                        placeholder="Old Password"
                        secureTextEntry={true}
                        placeholderTextColor='rgba(0,128,0,0.6)'
                        maxLength={10}
                        returnKeyType='next'
                        ref={(input) => this.oldPInput = input}
                        onChangeText = {oldPassword=>this.setState({oldPassword})}
                        onSubmitEditing={() => this.newPInput.focus()}
                    />
                    <Icon name={'ios-cog'} size={SCREEN_HEIGHT * 0.035} color='red' style={styles.usernameIcon} />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.username}
                        placeholder="New Password"
                        secureTextEntry={true}
                        placeholderTextColor='rgba(0,128,0,0.6)'
                        maxLength={10}
                        returnKeyType='next'
                        ref={(input) => this.newPInput = input}
                        onChangeText = {newPassword=>this.setState({newPassword})}
                        onSubmitEditing={() => this.conPInput.focus()}
                    />
                    <Icon name={'ios-lock'} size={SCREEN_HEIGHT * 0.035} color='red' style={styles.usernameIcon} />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.username}
                        placeholder="Confirm New Password"
                        secureTextEntry={true}
                        placeholderTextColor='rgba(0,128,0,0.6)'
                        maxLength={10}
                        returnKeyType='done'
                        ref={(input) => this.conPInput = input}
                        onChangeText = {confirmPassword=>this.setState({confirmPassword})}
                    />
                    <Icon name={'ios-lock'} size={SCREEN_HEIGHT * 0.035} color='red' style={styles.usernameIcon} />
                </View>
                <View>
                    <TouchableOpacity 
                            style={{
                                backgroundColor: "#ED4C67",
                                marginTop: SCREEN_HEIGHT * 0.05,
                                width: SCREEN_WIDTH * 0.87,
                                height: SCREEN_HEIGHT * 0.065,
                                borderRadius: SCREEN_WIDTH * 0.09,
                                alignSelf: 'center',
                            }} 
                            onPress={()=>this.validateFields()}>
                        <Text style={styles.btnText}>Change Password</Text>
                    </TouchableOpacity> 
                </View>
            </TouchableOpacity>
            </ScrollView>
        </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(52, 73, 94,0.8)',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  mainBox: {
    marginTop: SCREEN_HEIGHT * 0.02,
    width: SCREEN_WIDTH * 0.95,
    height: SCREEN_HEIGHT * 0.47,
    borderRadius: SCREEN_WIDTH * 0.09,
    backgroundColor: 'rgba(52, 73, 94,1.0)',
    alignSelf: 'center',
  },
  inputContainer: {
    marginTop: SCREEN_HEIGHT * 0.015
  },
  username: {
    marginTop: SCREEN_HEIGHT * 0.022,
    marginHorizontal: SCREEN_WIDTH * 0.045,
    paddingLeft: SCREEN_WIDTH * 0.14,
    paddingRight: SCREEN_WIDTH * 0.2,
    color: '#008000',
    backgroundColor: 'white',
    width: SCREEN_WIDTH * 0.87,
    height: SCREEN_HEIGHT * 0.07,
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: 'bold',
    textAlignVertical: 'center',
    borderRadius: SCREEN_WIDTH * 0.09,
  },
  usernameIcon: {
    position: "absolute",
    top: SCREEN_HEIGHT * 0.038,
    left: SCREEN_WIDTH * 0.09
  },
  generateBtn: {
    marginTop: SCREEN_HEIGHT * 0.03,
    width: SCREEN_WIDTH * 0.87,
    height: SCREEN_HEIGHT * 0.065,
    borderRadius: SCREEN_WIDTH * 0.09,
    backgroundColor: '#ED4C67',
    alignSelf: 'center',
  },
  btnText: {
    fontSize: SCREEN_WIDTH * 0.06,
    width: SCREEN_WIDTH * 0.87,
    height: SCREEN_HEIGHT * 0.065,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginVertical: SCREEN_HEIGHT * 0.01,
  },
});

AppRegistry.registerComponent('ChangePassword', ()=> ChangePassword);