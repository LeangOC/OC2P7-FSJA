package com.openclassroom.devops.orion.microcrm;

import static org.junit.jupiter.api.Assertions.*;

import java.util.ArrayList;
import java.util.Date;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

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

    @Test
    void shouldReturnId() {

        Organization organization = new Organization();

        ReflectionTestUtils.setField(organization, "id", 42L);

        assertEquals(42L, organization.getId());
    }

    @Test
    void shouldReturnCreatedAt() {

        Organization organization = new Organization();
        Date createdAt = new Date();

        ReflectionTestUtils.setField(organization, "createdAt", createdAt);

        assertSame(createdAt, organization.getCreatedAt());
    }

    @Test
    void shouldReturnUpdatedAt() {

        Organization organization = new Organization();
        Date updatedAt = new Date();

        ReflectionTestUtils.setField(organization, "updatedAt", updatedAt);

        assertSame(updatedAt, organization.getUpdatedAt());
    }
}