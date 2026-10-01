/* Newcomer given names, 150+ per nation, grouped by where they come from.
 * Robert, 2026-10-01: "Make a large number of names to pull from. Like 150 per
 * region." and "I want an ideal meld of the inspiration(s) regardless of
 * reality." So: Marium and Themelios (one inspiration each) keep their own
 * names; in the five MIXED nations every group is a `meld:` group. There are
 * no pure-source lists there, and check-names.js enforces it.
 *
 * The mixed-nation names are hand-fused from sound recipes (see NATIONS.md):
 * stems of one tongue in the music of the other, and names that sit natively in
 * both. Cross-multiplying stems and endings by machine produced mostly ugly
 * results, so every name here was chosen by ear.
 *
 * Rules the checks enforce: ASCII, one capitalised word, no name in two
 * regions, nothing that collides with the named cast or canon characters,
 * nothing from the BLOCK lint. Names are given names only; house names live in
 * names.js HOUSES and are used for named characters.
 */
(function (root) {
  'use strict';
  function L(s) { return s.split(/[\s,]+/).filter(Boolean); }

  var DATA = {
    'Marium': {
      'men (praenomina and cognomina)': L(`Lucan Marcellus Cassian Quintus Decimus Rufus Severus Gaius Lucius Marcus Titus Publius Aulus Sextus Septimus Gnaeus Tiberius Servius Manius Appius Numerius Faustus Felix Crispus Macer Naso Cato Varro Gallus Valens Pius Priscus Maximus Atticus Balbus Celsus Corvus Drusus Fronto Geminus Lupus Piso Silvanus Taurus Urbanus Vindex Vitalis Verus Sabinus Brocchus`),
      'men (later Latin)': L(`Aurelian Valerian Hadrian Trajan Antoninus Claudian Maximian Constans Julian Flavian Lucilian Marian Paulinus Fabian Rufinus Justin Optatus Vitalian Gordian Probus Carus Florian Gratian Jovian Martian Sergius Victorinus Aemilian Palladius Valentinian`),
      'women': L(`Aurelia Livia Valeria Sabina Flavia Cornelia Octavia Julia Claudia Lucilla Marcella Faustina Drusilla Tullia Fulvia Antonia Cassia Domitia Lepida Plautia Quinta Sulpicia Servilia Terentia Vibia Atia Calpurnia Camilla Fabiola Helvia Juventia Laelia Lavinia Livilla Lucretia Maxima Minervina Nonia Paulina Petronia Pomponia Postumia Prisca Rufina Secunda Tertia Ulpia Vitalia Veturia Aemilia Albina Aquilina Balbina Caecilia Candida Clementia Crispina Decima Florentia Fortunata Gaia Hortensia Justina Larentia Lucia Marciana Martina Octavilla Pia Priscilla Regina Rufilla Sergia Sextia Severa Silvana Urbana Valentina Venusta Verecunda Victoria Viviana`)
    },
    'Themelios': {
      'men': L(`Alexios Theron Leandros Kosmas Stavros Argyros Aristarchos Diomedes Demetrios Dionysios Evander Euripides Philon Lysander Pericles Themistokles Sophokles Xenophon Theodoros Timotheos Zosimos Andreas Anastasios Apollonios Archidamos Basileios Chrysanthos Damianos Dorotheos Eleftherios Epaminondas Eumenes Eustathios Georgios Hektor Iason Ioannis Kallias Konstantinos Kyriakos Leon Lykourgos Menelaos Nestor Nikephoros Odysseus Orestes Pavlos Perseus Philippos Polydoros Prokopios Pyrrhos Spyridon Stephanos Thaddeos Theodotos Thanasis Thales Thrasyvoulos Tryphon Xenophanes Zenon`),
      'men (older and learned names)': L(`Agathon Aischylos Alkibiades Amyntas Anaxagoras Antiochos Archelaos Aristoteles Cleomenes Demokritos Empedokles Eudoxos Glaukos Hippolytos Isidoros Kimon Kritias Lykos Melanthios Milon Neoptolemos Nikias Pausanias Phokion Pindaros Plutarchos Protagoras Telemachos Teucer`),
      'women': L(`Eudora Callista Demetra Zoe Ioanna Melina Dorothea Xenia Thaleia Theodora Kassandra Penelope Ariadne Andromache Antigone Aspasia Chloe Daphne Eirene Eleni Elpida Euphemia Eurydike Hypatia Iris Kalliope Kleio Korinna Kyra Leda Lysandra Melpomene Nike Olympias Ourania Pelagia Persephone Phaedra Philomena Phoebe Polyxena Rhea Sappho Selene Sophia Theano Thekla Tyche Xanthe Zenobia Agathe Aglaia Alkmene Anthousa Artemisia Athenais Berenike Charis Chrysanthe Danae Dionysia Elektra Euphrosyne Hermione Kallisto Kyriaki Maira Myrto Nausikaa Panagiota Paraskevi Roxane`),
      'women (more)': L(`Aikaterine Ambrosia Briseis Charikleia Chryseis Eleftheria Eugenia Galene Glykeria Kalypso Kleopatra Lais Leto Myrine Nephele Olympia`)
    },
    'Reyjar': {
      'meld: Norse stems, Iberian music (men)': L(`Halvardo Torvaldo Torbaldo Eirico Ragnaldo Ragnaro Sigurdo Gunnaro Gunnardo Ulfrico Ottaro Ottilio Arnaldo Sveno Haraldo Olavo Ivaro Einaro Magno Bjornardo Canuto Ormando Ingvaro Grimaldo Esteinar Thoralfo Gudmundo Leifardo Orvaldo Sigvaldo Sigfrido Halfredo Gunfrido Haukardo Magnaldo Einaldo Svenardo Arnardo Esvaldo Orlando Rolando Arnulfo Gundulfo Ragnulfo`),
      'meld: Norse stems, Iberian music (women)': L(`Sigruna Gudruna Ragnilda Ingrida Astrida Estrida Torilda Solveiga Gunilda Hildegunda Thorgunna Brynhilda Svanilda Ingeborga Sigrida Alfhilda Aslauga Hallgerda Jorunna Ingunna Gunnvora Liva Eira Tora Gerda Embla Helga Yrsa Unna Signa Esvena Alva Ermengarda Ottilia`),
      'meld: Iberian stems, Norse bite': L(`Ramund Bermund Velmund Fernulf Fernhild Gonzulf Leonulf Leovard Leovald Rodrik Alvar Elvhild Elvrun Velhild Velrun Ermenhild Ermenulf Brunhild`),
      'meld: where north and south already met': L(`Rodrigo Alvaro Gonzalo Elvira Alonso Alfonso Fernando Ramiro Alarico Ataulfo Recaredo Leovigildo Teodorico Gundemaro Sigerico Eurico Amalarico Teudis Witerico Wamba Hermenegildo Ermesinda Brunilda Gontroda Gosinda Sunilda Munia Ingunda Froila Munio Nuno Rodulfo Gutierre Velasco Ordono Bermudo Pelayo Aznar Jimeno Lope Fortun Sancho Sancha Urraca Ximena Leonor Inigo Beltran Berenguela Aldonza Toda Oneca Velasquita Diego Garcia Mayor Teodomiro`)
    },
    'Li Trice': {
      'meld: Chinese syllables, French endings': L(`Lanette Lanelle Lanie Lanou Lanon Linette Linelle Linon Linot Linie Jinette Jinelle Jinon Jinot Jinie Wenette Wenelle Wenon Wenie Fanelle Fanie Fanon Yanette Yanelle Yanick Yanie Yanon Zhenette Zhenelle Zhenie Xinette Xinelle Xinie Xinon Qinette Qinelle Ninette Ninelle Lingette Lingelle Yinette Yinelle Yinon Anette Anelle Lulette Meilette Meilene Shulette Hualine Lanise Linise Jinise Wenise Fanise Zhenise Xinise Lanois Linois Jinois Wenois Yanois Lanaud Linaud Jinaud Wenaud Yanaud Linard Jinard Wenard Lanien Jinien Wenien Yanien`),
      'meld: French stems, Chinese endings': L(`Mirlan Mirlin Mirwen Mirmei Sorlan Sorlin Sorwen Sormei Ysalin Ysamei Ysawen Marlin Marlan Marwen Loulan Louwen Loumei Louling Camlin Camwen Cammei Luclin Lucwen Lucmei Aurlin Aurmei Aurlan Selmei Sellan Selwen Anglan Angmei Berlan Berwen Julmei Julwen Hellan Helwen`),
      'meld: names at home in both mouths': L(`Yann Mai Luce Lise Lin Lian Liane Lianne Lanne Line Ange Ang Lou Yun Yvon Fan Ren Rene Luc Lu Mirel Sorel Lilou Lucie Anlin Anmei Lanmei Meilan Lumei Luming Lulan Yuline Yveline Remei Anyan Aumei Meline Meiline`),
      'meld: the tail of a French name on a Chinese syllable': L(`Meianne Yuelise Xiulise Wenlise Jinlise Linlise Meilise Fanlise Yinglise`)
    },
    'Ayusti': {
      'meld: Japanese stems, Brazilian lilt': L(`Yukinha Harinha Mikinha Sorinha Akinha Takinho Naminha Uminha Kikinha Tominho Kazinho Suminha Fuminho Fumina Kiminha Yoshinho Toshinho Masinha Sakinha Hirinho Nobinho Natsinha Juninho Geninho Zeninho Seninho Iorinho Shirinho Tarinho Gorinho Eijinho Makotinho Seijinho Yasinho Yukinho Katsinho Aoinha Haninha Shizinha Tsurinha Kaminha Raninha Sayinha Yoninha Norikinha Sachinha Shininha Suzinha Taminha Fuyinha Sumirinha Rinara Namira Sumira Miyara Kimira Hanina Mikaela Soraia Takazinho Mikazinha Sorazinha Akizinha Haruzinho Hanazinha Namizinha Tomozinho Kazuzinho Miyozinha Fumizinha Kimizinha Aoizinha Sumizinha Hirozinho Shirozinho Tarozinho Gorozinho Yukizinha Natsuzinha`),
      'meld: Portuguese stems, Japanese lilt': L(`Mariko Marika Marimi Luzumi Luzuko Rosami Rosuke Rosuko Lucaro Caetaro Pedoro Tiagoro Teresumi Beatriko Catsumi Dulsumi`),
      'meld: new names built from both sound-worlds': L(`Akaro Takaru Takari Mikaru Mikari Sorano Soraru Yukaro Yukari Natsiana Namiara Tomaru Tomari Sakaio Sakari Mitsara Mitsari Ayumara Kiyara Kazuara`),
      'meld: names at home in both languages': L(`Rui Iuri Nina Caio Aya Mayara Mika Sora Lia Rei Rio Mari Rika Maya Mina Naomi Kaito Ana Ayumi Emi Yumi Nanami Leo Noa Niko Reina Rina Saori Aiko Yuna Sol Mara Taina Tais Tatsu Lara`)
    },
    'Beloufi': {
      'meld: Irish clan names as frontier first names': L(`Brennan Keegan Delaney Madigan Quinlan Riordan Sheridan Donovan Rafferty Tierney Kerrigan Callahan Hanlon Mulligan Doyle Boyle Murphy Nolan Quinn Rooney Sullivan Cleary Dempsey Fallon Maguire Brannigan Flanagan Hennessy Kavanagh Lafferty Mahoney Monaghan Nugent Oneill Quigley Reagan Shannon Sweeney Tiernan Whelan Gilroy Hogan Kearney Moran Brogan Carrigan Cassidy Connolly Costigan Darcy Egan Fagan Farrell Finnegan Galvin Gannon Geary Grady Keane Kehoe Larkin Logan Molloy Mooney Neville Phelan Regan Rourke Ryan Teague Tully Kilroy Mallory Lennon Keenan Doran Devlin Casey Conroy Dolan Duffy Garvey Healy Joyce Kirby Lowry Madden Nealon Rafter Slattery`),
      'meld: ogham trees and frontier nature': L(`Rowan Alder Birch Hazel Holly Willow Briar Bracken Clover Juniper Sage Fern Heather Thistle Linden Aspen Laurel Ivy Cedar Hawthorn Sorrel Bryony Linnet Finch Lark Starling Robin Piper Sparrow Heron Kestrel Marigold Primrose Rosemary`),
      'meld: saints and scripture (Irish calendar, American Bible)': L(`Patrick Bridget Colum Brendan Declan Ciaran Finnian Kilian Malachy Moira Kathleen Garrett Dennis Owen Columba Colman Fintan Gerard Kevin Aidan Enda Fiachra Ita Kieran Brigid Maura Michael Joseph Thomas Daniel Matthew Timothy Bartholomew Jeremiah Hannah Rachel Rebecca Susanna Seamus Eamon`)
    },
    'Edinius': {
      'meld: English stems in Lithuanian dress': L(`Godrikas Wulfrikas Oswinas Ulrikas Aldrikas Eadrikas Leofrikas Cuthbertas Godvinas Wulfstanas Atelstanas Haroldas Egbertas Dunstanas Cedrikas Brandas Osrikas Tostigas Beornas Cenredas Wystanas Elfrikas Sigebertas Svitinas Redvaldas Hervardas Leofvinas Osmundas Eadmundas Eadwardas Aldredas Ethelredas Hilde Aldite Etelreda Wulfilda Mildreda Osburga Ebbe Tove Hildegarda Fridesvyda Eanswita Leofruna Atelflede`),
      'meld: Lithuanian stems, English iron': L(`Vytwin Vytric Vytwald Gedwin Gedric Gedwulf Rimwald Rimwin Dainwulf Dainwin Algric Algwin Algmund Saulric Saulwin Gintric Gintwin Gintwulf Mantwin Mantric Rokwald Rokwin Tauric Taurwald Vaidric Rytwin Rytric Vilwin Vilric Kazwin Kazric Jaunwin Ludwin Kestwin Kestric Mindwald Mindwulf Daumwin Eimwin Eimric Zygwald Skirwin Traiwin Vykwin Jogwin Jogric Gedmund Rimmund Dainmund Saulmund Gintmund Laimhild Rashild Daivhild Mildburg Aldhild Eglehild Gabihild Giedhild Vaivhild Ausrhild Dalhild Ievhild`),
      'meld: diminutives worn both ways': L(`Wulfukas Oswinukas Godrukas Aldrukas Hildute Aldute Edute Berute Etelute Mildute Osbute Wulfute Godute Aldrute`),
      'meld: shared Germanic names, two spellings': L(`Edmundas Henrikas Alfredas Albertas Arnoldas Edgaras Edvardas Hermanas Herbertas Ernestas Ricardas Vilhelmas Adolfas Oskaras Rolandas Rodolfas Leopoldas Konradas Gerardas Reinoldas Edvinas Osvaldas Edita Matilda Adela Berta Elzbieta Gertruda Vilhelmina Ludvika Alfreda`)
    }
  };

  var API = { DATA: DATA };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.OW_NAMES_DATA = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
