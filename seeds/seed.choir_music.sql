BEGIN;
    INSERT INTO choir_music
        (composer, arranger, title, voicing, number_copies, lang, instrumentation, notes)
    VALUES
        ('Adams, Anne', 'Tran-Adams, M.', 'Light of the World', 'SSAA', 46, 'English', 'Piano', ' '),
        ('Anonymous', ' ', 'Alleluia psallat', 'SSA', 35, 'English & Latin', 'Unaccompanied', ' '),
        ('Bruckner, A.', 'Mason, D. G.', 'Ave Maria', 'SSA/SSAA', 34, 'Latin', 'Unaccompanied', ' '),
        ('Butler, John', ' ', 'Psalm 150', 'SSA', 50, 'English', 'Piano or Organ', 'Copied from manuscript WITH permission'),
        ('Gibbons, O.', 'Ledger, Philip', 'Drop, Drop Slow Tears', 'SSA', 35, 'English', 'Unaccompanied', ' '),
        ('Hayes, Mark', ' ', 'Home on the Range', 'TTBB', 25, 'English', 'Piano', 'Harmonica/C instrument optional'),
        (' ', 'Loomer, Diane', 'Ave maris stella', 'TTBB', 4, 'Latin', 'Unaccompanied', 'Baritone Solo. 1992.'),
        ('Patriquin, Donald', ' ', 'Gentil Coquelicot', 'SSAA', 49, 'French', 'Piano', ' '),
        ('Royal, Matthew', ' ', 'If I Could Walk Out', 'SA', 29, 'English', 'Piano, Violin', 'Solos: Soprano, Alto'),
        ('Saindon, Marie-Claire', ' ', 'Le train d''hiver', 'SSA', 38, 'French', 'Unaccompanied', ' '),
        ('Watson-Henderson, Ruth', ' ', 'Cantate Domino', 'SSAA', 59, 'Latin, English', 'Piano or Organ, Trumpet', 'Soli for 6')
    ;
    COMMIT;