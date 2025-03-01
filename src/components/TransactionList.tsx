import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../store';

const TransactionList = () => {
  const transactions = useSelector(
    (state: RootState) => state.transaction.recent,
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Transactions</Text>
      {transactions.length === 0 ? (
        <Text style={styles.noTransactions}>No transactions yet</Text>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View style={styles.transaction}>
              <Text style={styles.name}>{item.name}</Text>
              <Text
                style={[
                  styles.amount,
                  // eslint-disable-next-line react-native/no-inline-styles
                  {color: item.type === 'debit' ? 'red' : 'green'},
                ]}>
                {item.type === 'debit' ? '-' : '+'}₦
                {item.amount.toLocaleString()}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: '#fff', padding: 15, borderRadius: 10},
  title: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
  noTransactions: {textAlign: 'center', color: '#888'},
  transaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  name: {fontSize: 16},
  amount: {fontSize: 16, fontWeight: 'bold'},
});

export default TransactionList;
