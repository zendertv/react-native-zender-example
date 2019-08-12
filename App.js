import React, { Component } from 'react';
import { AsyncStorage, SafeAreaView, Text, TextInput , Button, View , Picker } from 'react-native';
import { ZenderPlayerView } from 'react-native-zender';


// Example Device Login provider
// See authentication documentation for other providers such as Facebook,Google,JsonToken
const zenderAuthentication = {
    provider: "device" ,
    payload: {
        "token": "something-unique-like-the-uuid-of-the-phone",
        "name": "patrick",
        "avatar": "https://example.com/myavatar.png"
    }
}

const zenderConfig = {
    debugEnabled: false,
    // iOS: you need to listen for the deviceToken and pass it here
    // Android:
    deviceToken: "<deviceToken used for push notification without spaces>"
}

type Props = {};
export default class App extends Component<Props> {

    constructor(props) {
        super(props);
        console.log("init here");
        this.loadConfig();
        this.onZenderPlayerClose = this.onZenderPlayerClose.bind(this);
        this.onZenderPlayerQuizShareCode = this.onZenderPlayerQuizShareCode.bind(this);
        this.togglePlayer = this.togglePlayer.bind(this);
        this.saveConfig = this.saveConfig.bind(this);
        this.state = {
            showPlayer : false,
            targetId: '',
            channelId: '',
            environment: ''
        };
    }

    // Use this callback to handle when the users wants to close the view
    onZenderPlayerClose(event) {
        console.log('Zender Player Close Event');
        this.setState({ showPlayer: false });

    }

    // This callback provides you with the information to make a shareobject with a deeplink
    onZenderPlayerQuizShareCode(event) {
        console.log('Zender Player Share code Event');
        console.log('Share text: '+event.shareText);
        console.log('Share code: '+event.shareCode);
    }

    togglePlayer = function() {
        this.setState({ showPlayer: !this.state.showPlayer});
    }


    saveConfig = async () => {
        try {
            await AsyncStorage.setItem('zenderTargetId', this.state.targetId   );
            await AsyncStorage.setItem('zenderChannelId', this.state.channelId  );
            await AsyncStorage.setItem('zenderEnvironment', this.state.environment  );
        } catch (error) {
            console.log(error);
            // Error saving data
        }
    }

    loadConfig = async () => {
        try {
            const targetId = await AsyncStorage.getItem('zenderTargetId');
            const channelId = await AsyncStorage.getItem('zenderChannelId');
            const environment = await AsyncStorage.getItem('zenderEnvironment');
            if (targetId !== null) { this.setState({ 'targetId': targetId }); console.log(targetId); }
            if (channelId !== null) { this.setState({ 'channelId': channelId }); console.log(channelId); }
            if (environment !== null) { 
		 this.setState({ 'environment': environment }); console.log(environment); 
	         zenderConfig['environment'] = this.state.environment;
            }
        } catch (error) {
            console.log(error);
            // Error retrieving data
        }
    }

    render() {

        if (this.state.showPlayer) {
            return <ZenderPlayerView
            targetId={ this.state.targetId }
            channelId={ this.state.channelId }
            authentication = { zenderAuthentication }
            config = { zenderConfig }
            onZenderPlayerClose={ this.onZenderPlayerClose }
            onZenderPlayerQuizShareCode={ this.onZenderPlayerQuizShareCode }
            style={{ 
                flex: 1 , 
                backgroundColor: '#9FA8DA' // By default the view is transparent if no background has been set , set your own default color
            }} 
            />; // be sure to add flex:1 so the view appears full size
        } else {
            return (
                <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
                <Text>targetId</Text>
                <TextInput style={{height: 40}} placeholder="your targetId" value={this.state.targetId}           onChangeText={(targetId) => this.setState({targetId})} />
                <Text>channelId</Text>
                <TextInput style={{height: 40}} placeholder="your channelId" value={this.state.channelId}           onChangeText={(channelId) => this.setState({channelId})} />
                <Text>environment</Text>
                <Picker selectedValue={this.state.environment} style={{height: 50, width: 400}} onValueChange={(itemValue, itemIndex) => this.setState({ environment: itemValue}) }>
                <Picker.Item label="production" value="production" />
                <Picker.Item label="staging" value="staging" />
                </Picker>

                <Button title="Save" onPress={this.saveConfig} />
                <Button title="Launch Player" onPress={this.togglePlayer} />
                </SafeAreaView>
            );
        }
    }
}
