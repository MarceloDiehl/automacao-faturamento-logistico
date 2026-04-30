package com.dsup.dsup.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "comarcas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comarca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String nome;


    @ManyToOne
    @JoinColumn(name = "regiao_id")
    private Regiao regiao;
}