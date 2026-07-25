package com.openclassroom.devops.orion.microcrm;

import static org.junit.jupiter.api.Assertions.*;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Date;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

class PersonTest {

    @Test
    void constructorShouldInitializeFields() {

        Person person = new Person("John", "Doe", "john@test.com");

        assertEquals("John", person.getFirstName());
        assertEquals("Doe", person.getLastName());
        assertEquals("john@test.com", person.getEmail());
    }

    @Test
    void settersShouldWork() {

        Person person = new Person();

        person.setFirstName("John");
        person.setLastName("Doe");
        person.setEmail("john@test.com");
        person.setPhone("010203");
        person.setBio("Developer");

        assertEquals("John", person.getFirstName());
        assertEquals("Doe", person.getLastName());
        assertEquals("john@test.com", person.getEmail());
        assertEquals("010203", person.getPhone());
        assertEquals("Developer", person.getBio());
    }

    @Test
    void shouldReturnId() {

        Person person = new Person();

        ReflectionTestUtils.setField(person, "id", 42L);

        assertEquals(42L, person.getId());
    }

    @Test
    void shouldReturnCreatedAt() {

        Person person = new Person();
        Date createdAt = new Date();

        ReflectionTestUtils.setField(person, "createdAt", createdAt);

        assertSame(createdAt, person.getCreatedAt());
    }

    @Test
    void shouldReturnUpdatedAt() {

        Person person = new Person();
        Date updatedAt = new Date();

        ReflectionTestUtils.setField(person, "updatedAt", updatedAt);

        assertSame(updatedAt, person.getUpdatedAt());
    }

    @Test
    void preRemoveShouldRemovePersonFromOrganizations() throws Exception {

        Person person = new Person();

        Organization organization = new Organization();
        organization.addPerson(person);

        ArrayList<Organization> organizations = new ArrayList<>();
        organizations.add(organization);

        Field field = Person.class.getDeclaredField("organizations");
        field.setAccessible(true);
        field.set(person, organizations);

        Method method = Person.class.getDeclaredMethod("remoteFromOrganization");
        method.setAccessible(true);
        method.invoke(person);

        assertFalse(organization.getPersons().contains(person));
    }
}