from manim import *

# Buffalo Counter Color Palette (derived from project CSS)
BG = "#1A1A1A"
PRIMARY = "#D4A574"  # Warm Tan
SECONDARY = "#DAA520"  # GoldenRod
DANGER = "#DC143C"      # Crimson
DIM = "#666666"
WHITE = "#EAEAEA"
MONO = "DejaVu Sans Mono"  # Linux fallback for Menlo

class Scene1_Introduction(MovingCameraScene):
    """Establish the scale: 60 million animals. The herd fills the screen."""
    def construct(self):
        self.camera.background_color = "#0D0D0D"  # Near-black for contrast
        # Create a herd of dots — bright, distinct, scattered
        herd = VGroup()
        import random
        random.seed(42)
        for _ in range(80):
            dot = Dot(
                radius=0.12, 
                color=PRIMARY, 
                fill_opacity=0.9
            ).move_to([random.uniform(-6.5, 6.5), random.uniform(-3.5, 3.5), 0])
            herd.add(dot)

        title = Text("The Buffalo Counter", font=MONO, font_size=42, color=WHITE, weight=BOLD)
        title.to_edge(UP, buff=0.6)
        
        sub = Text("Before 1800, the Great Plains held the largest congregation", 
                   font=MONO, font_size=20, color="#AAAAAA")
        sub.next_to(title, DOWN, buff=0.3)

        big_num = Text("60,000,000", font=MONO, font_size=96, color=SECONDARY, weight=BOLD)

        # Animation Sequence
        self.play(FadeIn(herd, lag_ratio=0.04, run_time=2.0))
        self.wait(0.8)
        
        self.play(Write(title, run_time=1.2))
        self.play(FadeIn(sub, run_time=1.0))
        self.wait(0.5)
        
        self.play(FadeIn(big_num, shift=DOWN, run_time=1.0))
        self.wait(2.0)
        
        self.play(FadeOut(Group(*self.mobjects)), run_time=0.6)
        self.wait(0.2)


class Scene2_TheSlide(Scene):
    """The steady decline: Hide Trade, Railroads, 30M -> 5M."""
    def construct(self):
        self.camera.background_color = BG
        
        # Header
        header = Text("The Slide", font=MONO, font_size=36, color=WHITE, weight=BOLD)
        header.to_edge(UP, buff=0.5)

        # Main Counter
        counter60m = Text("60,000,000", font=MONO, font_size=72, color=PRIMARY, weight=BOLD)
        counter60m.next_to(header, DOWN, buff=1.0)
        
        # Year Label
        year_label = Text("1800", font=MONO, font_size=30, color=DIM)
        year_label.to_corner(UL)

        # Timeline
        timeline = Line(LEFT*5, RIGHT*5, color=DIM)
        timeline.to_edge(DOWN, buff=1.5)
        
        timeline_labels = VGroup(
            Text("1800", font=MONO, font_size=16, color=DIM).move_to(timeline.get_start() + DOWN*0.4),
            Text("1830", font=MONO, font_size=16, color=DIM).next_to(timeline.get_start(), RIGHT, buff=1.8).shift(DOWN*0.4),
            Text("1860", font=MONO, font_size=16, color=DIM).move_to(timeline.get_center() + DOWN*0.4),
            Text("1870", font=MONO, font_size=16, color=DIM).next_to(timeline.get_end(), LEFT, buff=1.8).shift(DOWN*0.4),
        )

        # Sequence
        self.play(Write(header), FadeIn(year_label))
        self.play(Write(counter60m))
        self.play(Create(timeline), FadeIn(timeline_labels))
        
        # Step 1: 1830 Hide Trade
        event1 = Text("1830: The Hide Trade Begins", font=MONO, font_size=20, color=SECONDARY)
        event1.move_to(timeline_labels[1].get_center() + UP*0.5)
        marker1 = Line(event1.get_bottom(), timeline_labels[1].get_top() + UP*0.1, color=SECONDARY)
        
        self.wait(0.5)
        self.play(FadeIn(event1), Create(marker1))
        
        # Update to 30M / 1850
        counter30m = Text("30,000,000", font=MONO, font_size=72, color=SECONDARY, weight=BOLD)
        counter30m.move_to(counter60m)
        
        year1850 = Text("1850", font=MONO, font_size=30, color=DIM)
        year1850.move_to(year_label)

        self.play(ReplacementTransform(counter60m, counter30m), FadeTransform(year_label, year1850), 
                  event1.animate.set_color(DIM).scale(0.8))
        self.wait(1.0)

        # Step 2: 1860 Railroads
        event2 = Text("1860: Railroads Reach the Plains", font=MONO, font_size=20, color=SECONDARY)
        event2.move_to(timeline_labels[2].get_center() + UP*0.8)
        marker2 = Line(event2.get_bottom(), timeline_labels[2].get_top() + UP*0.1, color=SECONDARY)

        self.play(FadeIn(event2), Create(marker2))
        
        # Update to 5M / 1870
        counter5m = Text("5,000,000", font=MONO, font_size=72, color="#FF8C00", weight=BOLD) # Orange
        counter5m.move_to(counter30m)
        
        year1870 = Text("1870", font=MONO, font_size=30, color=DIM)
        year1870.move_to(year1850)

        self.play(ReplacementTransform(counter30m, counter5m), FadeTransform(year1850, year1870),
                  event2.animate.set_color(DIM).scale(0.8))
        self.wait(1.0)

        # Cleanup for next scene
        self.play(FadeOut(Group(*self.mobjects), run_time=0.5))
        self.wait(0.2)


class Scene3_Collapse(Scene):
    """The rapid destruction. The 'Aha' moment. 5M -> 500."""
    def construct(self):
        self.camera.background_color = BG
        
        # Start at 5M
        counter = Text("5,000,000", font=MONO, font_size=80, color="#FF8C00", weight=BOLD)
        self.play(FadeIn(counter, scale=0.5))
        self.wait(0.5)
        
        # Flash to Danger
        counter_5m_red = Text("5,000,000", font=MONO, font_size=80, color=DANGER, weight=BOLD)
        counter_5m_red.move_to(counter)
        self.play(ReplacementTransform(counter, counter_5m_red), run_time=0.8)
        self.wait(0.5)
        
        # Rapid Drop: 1874 US Army Campaigns
        label_army = Text("1874: US Army Campaigns", font=MONO, font_size=24, color=DANGER)
        label_army.to_edge(DOWN, buff=1.0)
        
        counter_200k = Text("200,000", font=MONO, font_size=80, color=DANGER, weight=BOLD)
        counter_200k.move_to(counter_5m_red)
        
        self.play(Write(label_army))
        self.play(ReplacementTransform(counter_5m_red, counter_200k))
        self.wait(1.0)

        # Rapid Drop: 1883 Last Herds
        label_last = Text("1883: The Last of the Herds", font=MONO, font_size=24, color=DANGER)
        label_last.move_to(label_army)
        
        counter_1k = Text("1,000", font=MONO, font_size=80, color=DANGER, weight=BOLD)
        counter_1k.move_to(counter_200k)
        
        self.play(ReplacementTransform(label_army, label_last), run_time=0.5)
        self.play(ReplacementTransform(counter_200k, counter_1k), run_time=1.0)
        self.wait(1.0)
        
        # The Silence: 500
        counter_500 = Text("~500", font=MONO, font_size=96, color=DANGER, weight=BOLD)
        counter_500.move_to(counter_1k)
        
        self.play(ReplacementTransform(counter_1k, counter_500))
        self.play(label_last.animate.set_color(DIM).scale(0.8))
        
        # 3 Seconds of silence
        self.wait(3.0)
        
        self.play(FadeOut(Group(*self.mobjects), run_time=1.0))
        self.wait(0.5)


class Scene4_Conclusion(Scene):
    """Resolution: This was policy. Link to interactive."""
    def construct(self):
        self.camera.background_color = BG
        
        final_num = Text("~500", font=MONO, font_size=96, color=DANGER, weight=BOLD)
        final_num.to_edge(UP, buff=1.5)
        
        text1 = Text("This wasn't nature.", font=MONO, font_size=30, color=WHITE, weight=BOLD)
        text1.move_to(ORIGIN)
        
        text2 = Text("This was policy.", font=MONO, font_size=30, color=WHITE, weight=BOLD)
        text2.next_to(text1, DOWN, buff=0.5)
        
        today = Text("Today ~500,000 exist. All on private ranches. None are truly wild.", 
                     font=MONO, font_size=22, color=DIM)
        today.to_edge(DOWN, buff=1.5)
        
        url = Text("bayarddevries.github.io/buffalo-counter", font=MONO, font_size=18, color=SECONDARY)
        url.next_to(today, DOWN, buff=0.8)

        # Sequence
        self.play(FadeIn(final_num, scale=0.3))
        self.play(Write(text1))
        self.wait(0.8)
        self.play(Write(text2))
        self.wait(1.0)
        
        self.play(FadeIn(today))
        self.wait(1.0)
        
        self.play(FadeIn(url))
        self.wait(2.0)
        
        self.play(FadeOut(Group(*self.mobjects), run_time=1.5))
        self.wait(0.5)
