package com.openclassroom.devops.orion.microcrm;

import static org.junit.jupiter.api.Assertions.*;

import java.util.ArrayList;

import org.junit.jupiter.api.Test;

class OrganizationTest {

    @Test
    void shouldAddPersonWhenListIsNull() {

        Organization organization = new Organization();
        Person person = new Person();

        organization.addPerson(person);

        assertEquals(1, organization.getPersons().size());
        assertTrue(organization.getPersons().contains(person));
    }

    @Test
    void shouldRemovePerson() {

        Organization organization = new Organization();
        Person person = new Person();

        organization.addPerson(person);

        organization.removePerson(person);

        assertTrue(organization.getPersons().isEmpty());
    }

    @Test
    void shouldSetPersons() {

        Organization organization = new Organization();

        ArrayList<Person> persons = new ArrayList<>();
        persons.add(new Person());

        organization.setPersons(persons);

        assertEquals(persons, organization.getPersons());
    }

    @Test
    void shouldSetName() {

        Organization organization = new Organization();

        organization.setName("OpenClassrooms");

        assertEquals("OpenClassrooms", organization.getName());
    }
}
