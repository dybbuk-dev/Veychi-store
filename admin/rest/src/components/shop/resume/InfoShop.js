/* eslint-disable react/no-array-index-key */

import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

import Title from "./Title";
import List, { Item } from "./List";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingLeft: 15,
    "@media max-width: 400": {
      paddingTop: 10,
      paddingLeft: 0,
    },
  },
  entryContainer: {
    marginBottom: 10,
    marginTop: 10,
  },
  date: {
    fontSize: 11,
    fontFamily: "Lato Italic",
  },
  detailContainer: {
    flexDirection: "row",
  },
  detailLeftColumn: {
    flexDirection: "column",
    marginLeft: 10,
    marginRight: 10,
  },
  detailRightColumn: {
    flexDirection: "column",
    flexGrow: 9,
  },
  bulletPoint: {
    fontSize: 10,
  },
  details: {
    fontSize: 10,
    fontFamily: "Lato",
  },
  headerContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  leftColumn: {
    flexDirection: "column",
    flexGrow: 9,
  },
  rightColumn: {
    flexDirection: "column",
    flexGrow: 1,
    alignItems: "flex-end",
    justifySelf: "flex-end",
  },
  title: {
    fontSize: 11,
    color: "black",
    textDecoration: "none",
    fontFamily: "Lato Bold",
  },
});

const ExperienceEntry = ({ label, value }) => {
  return (
    <View style={styles.entryContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.leftColumn}>
          <Text style={styles.title}>{label}</Text>
        </View>
        <View style={styles.rightColumn}>
          <Text style={styles.date}>{value}</Text>{" "}
        </View>
      </View>
    </View>
  );
};

const InfoShop = ({ userData }) => (
  <View style={styles.container}>
    <Title>Información de la Tienda</Title>
    <ExperienceEntry label="Nombre" value={userData.currentShop.shop.name} />
    <ExperienceEntry
      label="Descripción"
      value={userData.currentShop.shop.description}
    />
    <ExperienceEntry
      label="Nombre del titular de la cuenta"
      value={userData.currentShop.shop.balance.payment_info.name}
    />
    <ExperienceEntry
      label="Tipo de cuenta"
      value={userData.currentShop.shop.balance.payment_info.accountType}
    />
    <ExperienceEntry
      label="Correo electrónico del titular de la cuenta
"
      value={userData.currentShop.shop.balance.payment_info.email}
    />
    <ExperienceEntry
      label="Nombre del banco"
      value={userData.currentShop.shop.balance.payment_info.bank}
    />
    <ExperienceEntry
      label="Número de cuenta"
      value={userData.currentShop.shop.balance.payment_info.account}
    />
    <ExperienceEntry
      label="País"
      value={userData.currentShop.shop.address.country}
    />
    <ExperienceEntry
      label="Ciudad"
      value={userData.currentShop.shop.address.city}
    />
    <ExperienceEntry
      label="Estado o Región"
      value={userData.currentShop.shop.address.state}
    />
    <ExperienceEntry
      label="CÓDIGO POSTAL"
      value={userData.currentShop.shop.address.zip}
    />
    <ExperienceEntry
      label="Dirección"
      value={userData.currentShop.shop.address.street_address}
    />
  </View>
);

export default InfoShop;
