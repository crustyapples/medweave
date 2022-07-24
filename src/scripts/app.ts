import "../scss/main.scss";

import "bootstrap";
import * as $ from "jquery";
import Arweave from 'arweave';
import Account from "./account";
import ArDB from '@textury/ardb';

const arweave = Arweave.init({
  host: 'localhost',
  port: 1984,
  protocol: 'http'
});

const ardb = new ArDB(arweave);

const account = new Account();

$(() => {
  ardb.search('transactions').appName('TODO224466').find().then(async (txs) => {
    const $list = $('#itemsList');

    for(const tx of txs) {
      const res = await arweave.api.get(`${tx.id}`);
      $list.append(`<li>${res.data}</li>`);
    }
  });

  $('#itemAdd').on('submit', async e => {
    e.preventDefault();

    const $name = $('#name');
    const $birthDate = $('#birthdate');
    const $nric = $('#NRIC');
    const $phone = $('#phonenumber');
    const $hospitalID = $('#hospitalID');
    const $list = $('#itemsList');

    // const todo = $input.val().toString();
    const inputList = {
      "fullName": $name.val().toString(),
      "birthDate": $birthDate.val().toString(),
      "nric": $nric.val().toString(),
      "phone": $phone.val().toString(),
      "hospitalID": $hospitalID.val().toString(),
    }

    const patientData = JSON.stringify(inputList);

    const tx = await arweave.createTransaction({
      data: patientData
    });

    tx.addTag('App-Name', 'TODO224466');
    tx.addTag('Content-Type', 'application/json');

    await arweave.transactions.sign(tx);
    await arweave.transactions.post(tx);

    $list.append(`<li>
                        <a>Full Name: ${inputList.fullName}</a> <br>
                        <a>Birth Date: ${inputList.birthDate}</a> <br>
                        <a>NRIC: ${inputList.nric}</a> <br>
                        <a>Phone Number: ${inputList.phone}</a> <br>
                        <a>Hospital ID: ${inputList.hospitalID}</a> <br>
                  </li> <br>`);

  });

  $('#login').on('click', async e => {
    e.preventDefault();
    await account.login();
  });

  $('#logout').on('click', async e => {
    e.preventDefault();
    await account.logout();
  });
});