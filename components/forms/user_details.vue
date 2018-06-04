<template lang="pug">
  section.form
    b-field(label="Full Name")
        b-input(type="text" placeholder="(example: Shabir Ahmed)")

    b-field(label="Password")
        b-input(type="password" placeholder="******")

    b-field(label="Email")
        b-input(type="email" placeholder="(example: shabir@gmail.com)")

    b-field(label="CNIC")
        b-input(type="text" placeholder="xxxxx-xxxxxxx-x")

    b-field(label="Contact Number")
        b-input(type="text" placeholder="+92-xxx-xxx-xxxx")

    b-field(label="Address")
        b-input(type="text" placeholder="House No. #, Street Name, Area, City, Province, Country")

    b-field(label="Referral Code")
        b-input(type="text" placeholder="Enter member ID")
</template>
