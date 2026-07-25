package com.openclassroom.devops.orion.microcrm;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.lang.reflect.Field;

import org.junit.jupiter.api.Test;

class InitialDataFixtureTest {

    @Test
    void canBeLoadedReturnsTrueWhenRepositoryEmpty() throws Exception {

        InitialDataFixture fixture = new InitialDataFixture();

        PersonRepository personRepository = mock(PersonRepository.class);

        when(personRepository.count()).thenReturn(0L);

        Field field = InitialDataFixture.class.getDeclaredField("personRepository");
        field.setAccessible(true);
        field.set(fixture, personRepository);

        assertTrue(fixture.canBeLoaded());
    }

    @Test
    void canBeLoadedReturnsFalseWhenRepositoryNotEmpty() throws Exception {

        InitialDataFixture fixture = new InitialDataFixture();

        PersonRepository personRepository = mock(PersonRepository.class);

        when(personRepository.count()).thenReturn(5L);

        Field field = InitialDataFixture.class.getDeclaredField("personRepository");
        field.setAccessible(true);
        field.set(fixture, personRepository);

        assertFalse(fixture.canBeLoaded());
    }

    @Test
    void loadShouldSaveOrganization() throws Exception {

        InitialDataFixture fixture = new InitialDataFixture();

        OrganizationRepository organizationRepository = mock(OrganizationRepository.class);

        Field field = InitialDataFixture.class.getDeclaredField("organizationRepository");
        field.setAccessible(true);
        field.set(fixture, organizationRepository);

        fixture.load();

        verify(organizationRepository).saveAll(any());
    }
}
