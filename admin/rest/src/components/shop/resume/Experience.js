/* eslint-disable react/no-array-index-key */

import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

import Title from './Title';
import List, { Item } from './List';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingLeft: 15,
    '@media max-width: 400': {
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
    fontFamily: 'Lato Italic',
  },
  detailContainer: {
    flexDirection: 'row',
  },
  detailLeftColumn: {
    flexDirection: 'column',
    marginLeft: 10,
    marginRight: 10,
  },
  detailRightColumn: {
    flexDirection: 'column',
    flexGrow: 9,
  },
  bulletPoint: {
    fontSize: 10,
  },
  details: {
    fontSize: 10,
    fontFamily: 'Lato',
  },
  headerContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  leftColumn: {
    flexDirection: 'column',
    flexGrow: 9,
  },
  rightColumn: {
    flexDirection: 'column',
    flexGrow: 1,
    alignItems: 'flex-end',
    justifySelf: 'flex-end',
  },
  title: {
    fontSize: 11,
    color: 'black',
    textDecoration: 'none',
    fontFamily: 'Lato Bold',
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
          <Text style={styles.date}>{value}</Text>
        </View>
      </View>
    </View>
  );
};

const Experience = ({ userData }) => (
  <View style={styles.container}>
    <Title>Información</Title>
    <ExperienceEntry label="Nombre" value={userData.name} />
    <ExperienceEntry label="Email" value={userData.email} />
    <ExperienceEntry
      label="Nombre de la compañía"
      value={userData.company.name}
    />
    <ExperienceEntry label="Giro" value={userData.company.line_of_business} />
    <ExperienceEntry label="País" value={userData.company.tax_country} />
    <ExperienceEntry
      label="Teléfono Comercial"
      value={userData.company.business_phone}
    />
    <ExperienceEntry
      label="Descripción"
      value={userData.company.products_description}
    />
    <ExperienceEntry
      label="DNI de la Compañía"
      value={userData.company.dni_document.DNI}
    />
    <ExperienceEntry
      label="Nombre Representante Legal"
      value={userData.company.legal_representative.name}
    />
    <ExperienceEntry
      label="DNI Representante Legal"
      value={userData.company.legal_representative.dni_document.DNI}
    />
    <ExperienceEntry
      label="Teléfono Representante Legal"
      value={userData.company.legal_representative.phone}
    />
  </View>
);

export default Experience;
