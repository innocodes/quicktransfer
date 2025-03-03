import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// Custom icons from scratch
const SendIcon = () => (
  <View style={styles.iconContainer}>
    <View style={styles.arrowBody}>
      <View style={styles.arrowHead}>
        <View style={[styles.arrowHeadPart, styles.arrowHeadLeft]} />
        <View style={[styles.arrowHeadPart, styles.arrowHeadRight]} />
      </View>
    </View>
  </View>
);

const ReceiveIcon = () => (
  <View style={styles.iconContainer}>
    <View style={[styles.arrowBody, styles.receiveArrowBody]}>
      <View style={[styles.arrowHead, styles.receiveArrowHead]}>
        <View
          style={[
            styles.arrowHeadPart,
            styles.arrowHeadLeft,
            styles.receiveArrowHeadLeft,
          ]}
        />
        <View
          style={[
            styles.arrowHeadPart,
            styles.arrowHeadRight,
            styles.receiveArrowHeadRight,
          ]}
        />
      </View>
    </View>
  </View>
);

const HistoryIcon = () => (
  <View style={styles.iconContainer}>
    <View style={styles.clockOuterCircle}>
      <View style={styles.clockHand} />
      <View style={styles.clockHandShort} />
    </View>
  </View>
);

const MoreIcon = () => (
  <View style={styles.iconContainer}>
    <View style={styles.gridContainer}>
      <View style={styles.gridDot} />
      <View style={styles.gridDot} />
      <View style={styles.gridDot} />
      <View style={styles.gridDot} />
    </View>
  </View>
);

const QuickActions = () => {
  const navigation = useNavigation();

  const actions = [
    {
      id: 'send',
      title: 'Send Money',
      screen: 'SendMoney',
      color: '#3e7bfa',
      icon: SendIcon,
    },
    {
      id: 'receive',
      title: 'Receive',
      screen: 'ReceiveMoney',
      color: '#00c853',
      icon: ReceiveIcon,
    },
    {
      id: 'history',
      title: 'History',
      screen: 'Transactions',
      color: '#ff9500',
      icon: HistoryIcon,
    },
    {
      id: 'more',
      title: 'More',
      screen: 'More',
      color: '#8e8e93',
      icon: MoreIcon,
    },
  ];

  return (
    <View style={styles.container}>
      {actions.map(action => {
        const IconComponent = action.icon;
        return (
          <TouchableOpacity
            key={action.id}
            style={styles.actionButton}
            onPress={() => navigation.navigate(action.screen)}>
            <View
              style={[
                styles.iconWrapper,
                {backgroundColor: `${action.color}15`},
              ]}>
              <IconComponent />
            </View>
            <Text style={styles.actionText}>{action.title}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Send icon styles
  arrowBody: {
    width: 2,
    height: 12,
    backgroundColor: '#3e7bfa',
    position: 'relative',
  },
  arrowHead: {
    position: 'absolute',
    top: 0,
    left: -4,
    width: 10,
    height: 10,
  },
  arrowHeadPart: {
    position: 'absolute',
    width: 8,
    height: 2,
    backgroundColor: '#3e7bfa',
    top: 0,
  },
  arrowHeadLeft: {
    transform: [{rotate: '-45deg'}],
    left: 0,
  },
  arrowHeadRight: {
    transform: [{rotate: '45deg'}],
    right: 0,
  },
  // Receive icon styles
  receiveArrowBody: {
    backgroundColor: '#00c853',
  },
  receiveArrowHead: {
    top: 'auto',
    bottom: 0,
  },
  receiveArrowHeadLeft: {
    backgroundColor: '#00c853',
    transform: [{rotate: '45deg'}],
  },
  receiveArrowHeadRight: {
    backgroundColor: '#00c853',
    transform: [{rotate: '-45deg'}],
  },
  // History icon styles
  clockOuterCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ff9500',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  clockHand: {
    position: 'absolute',
    width: 6,
    height: 2,
    backgroundColor: '#ff9500',
    top: 7,
    right: 6,
    transform: [{rotate: '-45deg'}],
    transformOrigin: 'left center',
  },
  clockHandShort: {
    position: 'absolute',
    width: 4,
    height: 2,
    backgroundColor: '#ff9500',
    top: 3,
    left: 7,
    transform: [{rotate: '90deg'}],
    transformOrigin: 'left center',
  },
  // More icon styles
  gridContainer: {
    width: 16,
    height: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  gridDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8e8e93',
    margin: 1,
  },
  actionText: {
    color: '#333',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default QuickActions;
