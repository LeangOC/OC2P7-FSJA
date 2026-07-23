package com.openclassroom.devops.orion.microcrm.controller;

import com.openclassroom.devops.orion.microcrm.dto.FrontendLog;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import static net.logstash.logback.argument.StructuredArguments.keyValue;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "*")
public class FrontendLogController {

    private static final Logger logger =
            LoggerFactory.getLogger(FrontendLogController.class);

    @PostMapping
    public ResponseEntity<Void> receiveLog(@RequestBody FrontendLog log) {

        switch (log.getLevel().toUpperCase()) {

            case "ERROR":

                logger.error(
                        "Frontend log",
                        keyValue("application", log.getApplication()),
                        keyValue("source", log.getSource()),
                        keyValue("page", log.getPage()),
                        keyValue("level", log.getLevel()),
                        keyValue("message", log.getMessage()),
                        keyValue("timestamp", log.getTimestamp())
                );

                break;

            case "WARN":

                logger.warn(
                        "Frontend log",
                        keyValue("application", log.getApplication()),
                        keyValue("source", log.getSource()),
                        keyValue("page", log.getPage()),
                        keyValue("level", log.getLevel()),
                        keyValue("message", log.getMessage()),
                        keyValue("timestamp", log.getTimestamp())
                );

                break;

            default:

                logger.info(
                        "Frontend log",
                        keyValue("application", log.getApplication()),
                        keyValue("source", log.getSource()),
                        keyValue("page", log.getPage()),
                        keyValue("level", log.getLevel()),
                        keyValue("message", log.getMessage()),
                        keyValue("timestamp", log.getTimestamp())
                );
        }

        return ResponseEntity.ok().build();
    }
}